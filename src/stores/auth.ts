import { ref } from 'vue'
import { defineStore } from 'pinia'
import { initializeApp, FirebaseError } from 'firebase/app'
import {
  TotpMultiFactorGenerator,
  createUserWithEmailAndPassword,
  getAuth,
  getIdToken,
  getMultiFactorResolver,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  AuthErrorCodes,
  sendEmailVerification,
  type Auth,
  type MultiFactorResolver,
} from 'firebase/auth'
import { jwtDecode } from 'jwt-decode'

export interface ITokenSet {
  accessToken?: string
  refreshToken?: string
}
export interface IAuthResponse<T> {
  success: boolean
  errMsg?: string
  message?: string
  data?: T
}
export interface ILoginCredentials {
  email: string
  password: string
  twoFactor?: string
}
export enum AuthSocialProviderEnum {
  GOOGLE = 'GOOGLE',
  MICROSOFT = 'MICROSOFT',
}

export type IRegistrationCredentials = Omit<ILoginCredentials, 'twoFactor'>
const error_to_handle_in_login = 'auth/multi-factor-auth-required'

export const TOKEN_KEY = 'SITE_TOKENS'
const config = {
  apiKey: 'TEST',
  authDomain: 'TEST',
}

export enum AuthErrorEnum {
  UNKNOW = 'UNKNOW',
  INVALID_LOGIN_CREDENTIALS = 'INVALID_LOGIN_CREDENTIALS',
  EMAIL_EXISTS = 'EMAIL_EXISTS',
  TOO_MANY_REQUEST = 'TOO_MANY_REQUEST',
  INVALID_OOB_CODE = 'INVALID_OOB_CODE',
}

export const useAuthStore = defineStore('auth', () => {
  const app = initializeApp(config)
  const auth = ref<Auth>(getAuth(app))

  async function init(): Promise<void> {
    if (!auth.value) {
    }
  }

  async function registration({
    email,
    password,
  }: IRegistrationCredentials): Promise<IAuthResponse<ITokenSet>> {
    try {
      await init()
      const response = await createUserWithEmailAndPassword(auth.value, email, password)

      try {
        await sendEmailVerification(response.user)
      } catch (error) {
        return {
          success: false,
          errMsg: 'Failed to send verification email,please try again',
        }
      }

      return {
        success: true,
        message: `An email has been sent to "${email}", please check your inbox and click on verification link, you can close this page safely now.`,
        data: {
          accessToken: await response.user.getIdToken(),
          refreshToken: response.user.refreshToken,
        },
      }
    } catch (error) {
      const errMsg: string = error instanceof Error ? error.message : (error as string)
      console.log(errMsg)
      return {
        success: false,
        errMsg: 'Invalid details, check email address or password to ensure correction',
      }
    }
  }

  async function signin({
    email,
    password,
    twoFactor,
  }: ILoginCredentials): Promise<IAuthResponse<ITokenSet>> {
    try {
      await init()
      const userCredential = await signInWithEmailAndPassword(auth.value, email, password)

      if (!userCredential.user.emailVerified) {
        return {
          success: false,
          errMsg: 'Email is not verified',
        }
      } else {
        return {
          success: true,
          data: {
            accessToken: await userCredential.user.getIdToken(),
            refreshToken: userCredential.user.refreshToken,
          },
        }
      }
    } catch (error: any) {
      return loginErrorHandler(error, { twoFactor, email, password })
    }
  }

  async function refreshToken() {
    try {
      await init()
      if (auth.value && auth.value.currentUser) {
        const token = await getIdToken(auth.value?.currentUser, true)
        updateTokens({ accessToken: token })

        return token
      } else throw new Error()
    } catch (error: any) {
      throw new Error()
    }
  }

  async function logout() {
    try {
      localStorage.removeItem(TOKEN_KEY)
      await init()
      await signOut(auth.value)
    } catch (error) {}
  }

  async function getEmail() {
    await init()
    return auth.value?.currentUser?.email
  }

  async function loginErrorHandler(
    error,
    { twoFactor }: ILoginCredentials,
  ): Promise<IAuthResponse<ITokenSet>> {
    if ('code' in error && error.code == error_to_handle_in_login) {
      return totpHandler(error, twoFactor || '')
    } else {
      const errMsg: string = error instanceof Error ? error.message : (error as string)
      return { success: false, errMsg }
    }
  }
  async function totpHandler(error, twoFactorCode: string): Promise<IAuthResponse<ITokenSet>> {
    let mfaResolver, multiFactorAssertion
    const invalidTotpError = {
      success: false,
      errMsg: 'Invalid or Expired Totp code!',
    }

    const failureError = {
      success: false,
      errMsg: 'Failed to resolve multi-factor authentication',
    }

    if (!twoFactorCode?.length) {
      return invalidTotpError
    }

    try {
      mfaResolver = getMultiFactorResolver(auth.value, error)
      const { uid } = getTotpHintDetails(mfaResolver)
      multiFactorAssertion = TotpMultiFactorGenerator.assertionForSignIn(uid, twoFactorCode)
    } catch (error) {
      return failureError
    }

    if (!mfaResolver || !multiFactorAssertion) {
      return failureError
    }

    try {
      const userCredential = await mfaResolver.resolveSignIn(multiFactorAssertion)
      return {
        success: true,
        data: {
          accessToken: await userCredential.user.getIdToken(),
          refreshToken: userCredential.user.refreshToken,
        },
      }
    } catch (error) {
      return invalidTotpError
    }
  }
  function getTotpHintDetails(mfaResolver: MultiFactorResolver): {
    factorId: TotpMultiFactorGenerator
    uid: string
  } {
    const selectedIndex = 0 //only totp supported
    const targetHint = mfaResolver.hints[selectedIndex]
    if (!targetHint || !('uid' in targetHint) || !('factorId' in targetHint)) {
      throw new Error('Invalid remote service hint')
    }
    const { uid, factorId } = targetHint
    if (factorId != TotpMultiFactorGenerator.FACTOR_ID) {
      throw new Error('Unsupported remote service hint factor')
    }
    return { uid, factorId }
  }
  function updateTokens(tokens: ITokenSet) {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens))
  }
  function getTokens(): ITokenSet {
    return JSON.parse(
      localStorage.getItem(TOKEN_KEY) || JSON.stringify({ accessToken: null, refreshToken: null }),
    )
  }
  async function loginWithSocialProvider(
    socialProviderEnum: AuthSocialProviderEnum,
  ): Promise<ITokenSet> {
    try {
      await init()
      const provider = getCurrentSocialProvider(socialProviderEnum)
      const result = await signInWithPopup(auth.value, provider)
      const user = result.user

      return {
        accessToken: await user.getIdToken(),
        refreshToken: user.refreshToken,
      }
    } catch (error: any) {
      throw getAuthError(error)
    }
  }
  function getAuthError(error: FirebaseError): Error {
    switch (error.code) {
      case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
        return new Error('The email or password you entered is incorrect.')
      case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
        return new Error(
          'Too many failed login attempts. Please try again later or reset your password.',
        )
      case AuthErrorCodes.EMAIL_EXISTS:
        return new Error('The email or password you entered is incorrect.')
      case AuthErrorCodes.INVALID_OOB_CODE:
      case AuthErrorCodes.EXPIRED_OOB_CODE:
        return new Error('Invalid Code.')
      default:
        return new Error('There was a problem logging you in. Please try again later.')
    }
  }
  function getCurrentSocialProvider(socialProviderEnum: AuthSocialProviderEnum) {
    switch (socialProviderEnum) {
      case AuthSocialProviderEnum.GOOGLE:
        return new GoogleAuthProvider()
      case AuthSocialProviderEnum.MICROSOFT:
        return new OAuthProvider('microsoft.com')
    }
  }
  function getUserDetails(): any {
    const tokens = getTokens()
    const decodedAccess = jwtDecode(tokens.accessToken as any) as any
    return {
      ...decodedAccess,
      avatar: decodedAccess.picture,
    }
  }

  return {
    registration,
    signin,
    refreshToken,
    logout,
    getEmail,
    loginWithSocialProvider,
    getUserDetails,
    getTokens,
    updateTokens,
  }
})
