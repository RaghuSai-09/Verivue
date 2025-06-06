"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import FormField from "./FormField"
import { useRouter } from "next/navigation"
import { auth } from "@/firebase/client"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { signUp, signIn } from "@/lib/actions/auth.action"


type FormType = 'signup' | 'signin';

const AuthFormSchema = (type: FormType) => {
  return z.object({
    name: type === 'signup' ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
  })
}

const AuthForm = ({ type }: {type: FormType} ) => {

  const router = useRouter();
  const formSchema = AuthFormSchema(type);  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "signup") {
        const { name, email, password } = values;

        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const result = await signUp({ 
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        })

        if(!result?.success) {
          toast.error(result?.message);
          return;
        }
        
        toast.success("Account created successfully! Please sign in.");
        router.push('/signin');
      } else {

        const { email, password } = values;
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        
        const idToken = await userCredentials.user.getIdToken();
        if (!idToken) {
          toast.error("Sign In failed. Please try again.");
          return;
        }
        await signIn({
          email,
          idToken,
        })
        toast.success("Signed in successfully!");
        router.push('/');
      }
      
      // Reset form after submission
      form.reset();

    }
    catch (error) {
      toast.error(`An error occurred while submitting the form: ${error}`);
      
      console.error("Error submitting form:", error);
    }
  }

  const isSignIn = type === "signin";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src='/logo.png' alt='Logo' width={48} height={42} />
          <h2 className="text-primary-100">Verivue</h2>
        </div>
        <h3>Ace every question. No sweat, no cap</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
            {!isSignIn && ( 
                <FormField 
                  control = {form.control}
                  name="name"
                  label="Username" 
                  placeholder="Enter your username" 
                  type="text" 
                />
            )}
            <FormField 
                control = {form.control}
                name="email"
                label="Email" 
                placeholder="Enter your Email address" 
                type="email" 
            />
            <FormField 
                control = {form.control}
                name="password"
                label="Password" 
                placeholder="Enter your Password" 
                type="password" 
            />
            <Button className="btn" type="submit"> {isSignIn ? 'Sign in' : 'Create an Account'}</Button>
          </form>
        </Form>
        <p>
          {isSignIn ? 'New to Verivue? ' : 'Already have an account? '}
          <Link href={isSignIn ? '/signup' : '/signin'} className="text-user-primary font-bold ml-1">
            {isSignIn ? 'Create an Account' : 'Sign In'}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthForm