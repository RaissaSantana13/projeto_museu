import AccessibilityToolbar from '@/components/layout/AccessibilityToolbar';
import VLibras from '@/components/layout/VLibras';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AccessibilityToolbar />
      <VLibras />
      <div className="a11y-page-content">{children}</div>
    </>
  );
}