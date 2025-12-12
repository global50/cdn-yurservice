import {
  ContactInfoEntry,
  ContactType,
} from "../../apps/profile/src/types/contacts";
import {
  Mail,
  Phone,
  MessageCircle,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Link as LinkIcon,
  type LucideIcon,
} from "lucide-react";
import { isValidPhoneNumber } from "libphonenumber-js";

export interface ContactTypeConfig {
  value: ContactInfoEntry["type"];
  label: string;
  icon: LucideIcon;
  urlPrefix?: string;
  placeholder: string;
  validateValue: (value: string) => boolean;
  formatValue: (value: string) => string;
}

export const CONTACT_TYPES: ContactTypeConfig[] = [
  {
    value: ContactType.phone,
    label: "Телефон",
    icon: Phone,
    placeholder: "+1234567890",
    validateValue: (value: string) => {
    return value.trim().length > 0;
  },
    formatValue: (value: string) => value.trim(),
  },
  {
    value: ContactType.email,
    label: "Email",
    icon: Mail,
    placeholder: "email@example.com",
    validateValue: (value: string) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },
    formatValue: (value: string) => value.trim().toLowerCase(),
  },
  {
    value: ContactType.telegram,
    label: "Telegram",
    icon: MessageCircle,
    urlPrefix: "https://t.me/",
    placeholder: "username (3-32 characters)",
    validateValue: (value: string) => {
      return /^[a-zA-Z0-9_]{5,32}$/.test(value.replace("@", ""));
    },
    formatValue: (value: string) => value.replace("@", "").trim(),
  },
  {
    value: ContactType.whatsapp,
    label: "WhatsApp",
    icon: MessageCircle,
    urlPrefix: "https://wa.me/",
    placeholder: "1234567890",
    validateValue: (value: string) => {
      const cleaned = value.replace(/[\s\-\(\)\+]/g, "");
      return /^[0-9]{10,15}$/.test(cleaned);
    },
    formatValue: (value: string) => value.replace(/[\s\-\(\)\+]/g, "").trim(),
  },
  {
    value: ContactType.github,
    label: "GitHub",
    icon: Github,
    urlPrefix: "https://github.com/",
    placeholder: "username",
    validateValue: (value: string) => {
      return /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,38}[a-zA-Z0-9])?$/.test(value);
    },
    formatValue: (value: string) => value.trim(),
  },
  {
    value: ContactType.linkedin,
    label: "LinkedIn",
    icon: Linkedin,
    urlPrefix: "https://linkedin.com/in/",
    placeholder: "username",
    validateValue: (value: string) => {
      return /^[a-zA-Z0-9-]{3,100}$/.test(value);
    },
    formatValue: (value: string) => value.trim(),
  },
  {
    value: ContactType.twitter,
    label: "Twitter",
    icon: Twitter,
    urlPrefix: "https://twitter.com/",
    placeholder: "username",
    validateValue: (value: string) => {
      return /^[a-zA-Z0-9_]{1,15}$/.test(value.replace("@", ""));
    },
    formatValue: (value: string) => value.replace("@", "").trim(),
  },
  {
    value: ContactType.website,
    label: "Веб-сайт",
    icon: Globe,
    urlPrefix: "https://",
    placeholder: "example.com",
    validateValue: (value: string) => {
      const urlPattern = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
      const cleanValue = value.replace(/^https?:\/\//, "");
      return urlPattern.test(cleanValue);
    },
    formatValue: (value: string) => value.replace(/^https?:\/\//, "").trim(),
  },
  {
    value: ContactType.link,
    label: "Ссылка",
    icon: LinkIcon,
    urlPrefix: "https://",
    placeholder: "example.com",
    validateValue: (value: string) => {
      const urlPattern = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
      const cleanValue = value.replace(/^https?:\/\//, "");
      return urlPattern.test(cleanValue);
    },
    formatValue: (value: string) => value.replace(/^https?:\/\//, "").trim(),
  },
];

export function getContactTypeConfig(
  type: ContactInfoEntry["type"]
): ContactTypeConfig | undefined {
  return CONTACT_TYPES.find((ct) => ct.value === type);
}

export function getContactIcon(type: ContactInfoEntry["type"]): LucideIcon {
  const config = getContactTypeConfig(type);
  return config?.icon || Globe;
}

export function generateContactLink(entry: ContactInfoEntry): string {
  if (entry.type === "phone") {
    return `tel:${entry.value}`;
  }

  if (entry.type === "email") {
    return `mailto:${entry.value}`;
  }

  const config = getContactTypeConfig(entry.type);
  if (config?.urlPrefix) {
    return `${config.urlPrefix}${entry.value}`;
  }

  return entry.value.startsWith("http")
    ? entry.value
    : `https://${entry.value}`;
}

export function getContactDisplayValue(entry: ContactInfoEntry): string {
  if (entry.label) {
    return entry.label;
  }

  if (
    entry.type === "phone" ||
    entry.type === "email" ||
    entry.type === "whatsapp"
  ) {
    return entry.value;
  }

  const config = getContactTypeConfig(entry.type);
  return config?.label || entry.value;
}

export function validateContactEntry(
  entry: Partial<ContactInfoEntry>
): string | null {
  if (!entry.type) {
    return "Укажите тип контакта";
  }

  if (!entry.value || !entry.value.trim()) {
    return "Укажите значение";
  }

  const config = getContactTypeConfig(entry.type);
  if (!config) {
    return "Неверный формат";
  }

  if (!config.validateValue(entry.value)) {
    if (entry.type === "telegram") {
      return "Имя пользователя Telegram должно содержать от 5 до 32 символов (буквы, цифры, подчеркивания)";
    }
    return `Неверный формат`;
  }

  return null;
}
