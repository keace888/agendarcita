import Header from '../../components/Header';
import IntakeForm from './IntakeForm';

export default async function AgendarDeptPage({
  params,
  searchParams,
}: {
  params: Promise<{ dept: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { dept } = await params;
  const sp = await searchParams;
  const queryString = new URLSearchParams(sp).toString();

  return (
    <>
      <Header />
      <IntakeForm dept={dept} queryString={queryString} />
    </>
  );
}
