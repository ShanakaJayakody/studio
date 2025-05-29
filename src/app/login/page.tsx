
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout 
      title="Welcome Back"
      description="Log in to access your UCAT prep."
      logoUrl="https://ik.imagekit.io/mwp/MWP%20Color%20no%20background.png?updatedAt=1745982959141"
      logoAlt="MED WITH PURPOSE Logo"
    >
      <LoginForm />
    </AuthLayout>
  );
}
