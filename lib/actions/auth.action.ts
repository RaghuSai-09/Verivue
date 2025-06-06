'use server';
import { auth, db } from '@/firebase/admin';
import { cookies } from 'next/headers';

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists) {
            return {
                success: false,
                message: 'User already exists. Please sign in instead.'
            }
        }
        await db.collection('users').doc(uid).set({
            name, email
        });

        return {
            success: true,
            message: 'User signed up successfully! Please Sign in.'
        }
    } catch (e) {
        console.error('Error during sign up:', e);

        if((e as { code?: string }).code === 'auth/EMAIL_exists') {
            return {
                success: false,
                message: 'Email already exists. Please use a different email address.'
            }
        }
        return {
            success: false,
            message: 'An error occurred during sign up. Please try again later.'
        }
    }
}


export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: 60 * 60 * 24 * 5 * 1000 // 5 days
    });
    cookieStore.set('session', sessionCookie, {
        maxAge: 60 * 60 * 24 * 5, // 5 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    })
}


export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            return {
                success: false,
                message: 'User not found. Please sign up first.'
            }
        }

        await setSessionCookie(idToken);

        return {
            success: true,
            message: 'Signed in successfully!'
        }
    } catch (e) {
        console.error('Error during sign in:', e);
        return {
            success: false,
            message: 'An error occurred during sign in. Please try again later.'
        }
    }
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
        return null;
    }

    try {
        const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection('users').doc(decodedToken.uid).get();
        if (!userRecord.exists) {
            return null;
        }

        return {
            ... userRecord.data(),
            id: userRecord.id,
        } as User;
    } catch (e) {
        console.error('Error getting current user:', e);
        return null;
    }
}


export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}