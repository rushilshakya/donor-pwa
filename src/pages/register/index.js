import Page from "@components/Page";
import { Register } from "@components/Register";
import DashboardLayout from "@layouts/dashboard/DashboardLayout";

const PAGE_TITLE = "Register";
const PAGE_TITLE = "Register";

Register.getLayout = (page) => (
  <DashboardLayout pageTitle={PAGE_TITLE}>{page}</DashboardLayout>
);

export default function Register() {
  return (
    <Page title={PAGE_TITLE}>
      <Register />
    </Page>
  );
}
