import { PageLoader } from '@/components/PageLoader';

export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-[#F4F2EE]">
      <PageLoader label="Opening secure sign-in…" />
    </div>
  );
}
