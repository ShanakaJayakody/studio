
import AuthLayout from '@/components/auth/AuthLayout';
import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <AuthLayout 
      title="Create Account"
      description="Sign up to start your UCAT prep journey."
      logoUrl="https://ik.imagekit.io/mwp/MWP%20Color%20no%20background.png?updatedAt=1745982959141"
      logoAlt="MED WITH PURPOSE Logo"
    >
      <SignupForm />
    </AuthLayout>
  );
}
