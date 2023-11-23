import { db } from '@/lib/db';

export async function generateMetadata({
	params,
}: {
	params: { courseId: string };
}) {
	const board = await db.course.findUnique({
		where: {
			id: params.courseId,
		},
	});

	return {
		title: board?.title || 'Board',
	};
}

const CourseIdLayout = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return <div>{children}</div>;
};

export default CourseIdLayout;
