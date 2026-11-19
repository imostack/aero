import { sendVendorRfq } from "./email";
import {
  createInvites,
  markInviteSent,
  vendorsForCategory,
  listVendors,
  type RequestRow,
  type Vendor,
} from "./rfq";

/** Creates invites for the given vendors (skipping ones already invited) and emails them. */
export async function inviteVendors(request: RequestRow, vendors: Vendor[]): Promise<string[]> {
  const created = await createInvites(
    request.id,
    vendors.map((v) => v.id)
  );
  const names: string[] = [];
  await Promise.all(
    created.map(async (c) => {
      const vendor = vendors.find((v) => v.id === c.vendor_id)!;
      const ok = await sendVendorRfq(vendor, request, c.token);
      if (ok) await markInviteSent(c.invite_id);
      names.push(vendor.name);
    })
  );
  return names;
}

/** Auto-dispatch: every active vendor tagged with the request's category. */
export async function autoDispatch(request: RequestRow): Promise<string[]> {
  const vendors = await vendorsForCategory(request.category);
  return inviteVendors(request, vendors);
}

export async function vendorsByIds(ids: number[]): Promise<Vendor[]> {
  const all = await listVendors();
  return all.filter((v) => ids.includes(v.id));
}
