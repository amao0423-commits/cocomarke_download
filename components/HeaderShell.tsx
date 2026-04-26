import Header from '@/components/Header';
import {
  getServiceOverviewDocumentId,
  serviceOverviewDownloadHref,
} from '@/lib/getServiceOverviewDocumentId';

export default async function HeaderShell() {
  const overviewId = await getServiceOverviewDocumentId();
  const serviceDocumentHref = serviceOverviewDownloadHref(overviewId);
  return <Header serviceDocumentHref={serviceDocumentHref} />;
}
