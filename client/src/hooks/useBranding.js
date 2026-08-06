import { useEffect, useState } from "react";
import { getBranding } from "../services/settingsService";

const DEFAULT_BRANDING = {
  systemName: "GodsEye",
  applicationTagline: "Missing Person Identification System",
  organizationName: "",
  departmentName: "",
  supportEmail: "",
};

function useBranding() {
  const [branding, setBranding] = useState(DEFAULT_BRANDING);

  useEffect(() => {
    let mounted = true;

    const loadBranding = async () => {
      try {
        const data = await getBranding();

        if (!mounted) return;

        setBranding({
          systemName: data.systemName || DEFAULT_BRANDING.systemName,
          applicationTagline:
            data.applicationTagline || DEFAULT_BRANDING.applicationTagline,
          organizationName:
            data.organizationName || DEFAULT_BRANDING.organizationName,
          departmentName:
            data.departmentName || DEFAULT_BRANDING.departmentName,
          supportEmail: data.supportEmail || DEFAULT_BRANDING.supportEmail,
        });
      } catch (error) {
        console.error(error);
      }
    };

    loadBranding();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    document.title = branding.systemName;
  }, [branding.systemName]);

  return branding;
}

export default useBranding;