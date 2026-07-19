import { MarketingLayout } from '@/layouts/MarketingLayout';
import { Button } from '@/components/Button';
import { ROUTES } from '@/constants/routes';

export default function NotFoundPage() {
  return (
    <MarketingLayout>
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-[4rem] font-extrabold text-text">404</p>
        <h1 className="mt-2 text-[1.4rem] font-bold text-text">Page not found</h1>
        <p className="mt-2 max-w-[26rem] text-[0.9rem] text-muted">The page you're looking for doesn't exist or has moved.</p>
        <Button href={ROUTES.home} variant="primary" className="mt-6">
          Back to home
        </Button>
      </div>
    </MarketingLayout>
  );
}
