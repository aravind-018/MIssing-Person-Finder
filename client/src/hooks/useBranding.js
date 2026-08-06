import { useEffect, useState } from "react";
import { getSettings } from "../services/settingsService";

const DEFAULT_BRANDING = {
  systemName: "GodsEye",
  applicationTagline: "Missing Person Identification System",
  organizationName: "",
  supportEmail: "",
};

function useBranding() {
  const [branding, setBranding] = useState(DEFAULT_BRANDING);

  useEffect(() => {
    let mounted = true;

    const loadBranding = async () => {
      try {
        const settings = await getSettings();

        if (!mounted) return;

        const general = settings.general || {};

        setBranding({
          systemName:
            general.systemName || DEFAULT_BRANDING.systemName,

          applicationTagline:
            general.applicationTagline ||
            DEFAULT_BRANDING.applicationTagline,

          organizationName:
            general.organizationName ||
            DEFAULT_BRANDING.organizationName,

          supportEmail:
            general.supportEmail ||
            DEFAULT_BRANDING.supportEmail,
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