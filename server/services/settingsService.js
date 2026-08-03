import SystemSettings from "../models/SystemSettings.js";

const SINGLETON_KEY = "system_settings";

/*
  Returns the single SystemSettings document, creating it with schema
  defaults the first time it's needed. Safe to call from anywhere
  (controllers, other services) without worrying about duplicates.
*/
export const getSystemSettings = async () => {
  let settings = await SystemSettings.findOne({
    singletonKey: SINGLETON_KEY,
  });

  if (!settings) {
    settings = await SystemSettings.create({
      singletonKey: SINGLETON_KEY,
    });
  }

  return settings;
};

/*
  Merges `data` into the given section (general / ai / camera /
  notifications / security / backup) of the singleton settings document
  and saves it. Only known top-level keys within that section are
  touched; unknown keys are ignored.
*/
export const updateSettingsSection = async (section, data, userId) => {
  const settings = await getSystemSettings();

  if (!settings[section] || typeof settings[section] !== "object") {
    const error = new Error(`Unknown settings section: ${section}`);
    error.statusCode = 400;
    throw error;
  }

  Object.keys(data || {}).forEach((key) => {
    if (key in settings[section]) {
      settings[section][key] = data[key];
    }
  });

  settings.markModified(section);

  settings.updatedBy = userId || null;

  await settings.save();
  console.log("Saving settings:", settings.security);

  return settings;
};

export default {
  getSystemSettings,
  updateSettingsSection,
};