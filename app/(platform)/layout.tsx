import { ClerkProvider, auth } from '@clerk/nextjs';
import { redirect, usePathname } from 'next/navigation';
import { Toaster } from 'sonner';

const PlatformLayout = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { user } = auth();

	// if (user == null) redirect('/landing');
	return (
		<ClerkProvider>
			<Toaster richColors />
			{children}
		</ClerkProvider>
	);
};

export default PlatformLayout;
