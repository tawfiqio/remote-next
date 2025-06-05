import { useUser } from '@clerk/nextjs';

export default function Dashboard() {
  const { user } = useUser();

  if (!user?.publicMetadata?.isAdmin) return <p>Access denied</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* List jobs, approve/delete, manage users */}
    </div>
  );
}
