"use client";

import React, { useState, useEffect } from "react";
import { Laptop, Smartphone, Download, BookOpen } from "lucide-react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { phrases } from "@/utils/i18n";
import { useSearchParams } from "next/navigation";
import Button from "@/app/components/ui/Button";
import Card, { CardContent } from "@/app/components/ui/Card";
import Alert from "@/app/components/ui/Alert";


// Type definition

type LanguageCode = "en" | "prs" | "ps" | "nr";

interface PhrasesType {
  keyboards: Record<LanguageCode, string>;
  downloadKeyboardText: Record<LanguageCode, string>;
  download: Record<LanguageCode, string>;
  installationGuide: Record<LanguageCode, string>;
  windows: Record<LanguageCode, string>;
  macos: Record<LanguageCode, string>;
  ios: Record<LanguageCode, string>;
  android: Record<LanguageCode, string>;
  comingSoon: Record<LanguageCode, string>;
  availableNow: Record<LanguageCode, string>;
  langSupport: Record<LanguageCode, string>;
  langSupportDetail: Record<LanguageCode, string>;
  windowsLangSupportDetail: Record<LanguageCode, string>;
  macOSLangSupportDetail: Record<LanguageCode, string>;
  underDev: Record<LanguageCode, string>;
  IOSLangSupportDetail: Record<LanguageCode, string>;
  AndroidLangSupportDetail: Record<LanguageCode, string>;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Tab Panel Component
function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`keyboard-tabpanel-${index}`}
      aria-labelledby={`keyboard-tab-${index}`}
      {...other}
    >
      {value === index && <div className="p-6">{children}</div>}
    </div>
  );
}

// Individual Keyboard Component
interface KeyboardComponentProps {
  platform: "windows" | "macos" | "ios" | "android";
  title: string;
  available: boolean;
  images?: string[];
  downloadUrl?: string;
  guideUrl?: string;
  lang: LanguageCode;
  phrases: PhrasesType;
}

const KeyboardComponent: React.FC<KeyboardComponentProps> = ({
  platform,
  title,
  available,
  images = [],
  downloadUrl,
  guideUrl,
  lang,
  phrases,
}) => {

 
  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    }
  };

  const handleGuide = () => {
    if (guideUrl) {
      window.open(guideUrl, "_blank");
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-6 items-center">
        {/* Status Chip */}
        <span
          className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
            available
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {available ? phrases.availableNow[lang] : phrases.comingSoon[lang]}
        </span>

        {/* Platform Description */}
        <p className="text-center text-gray-600 text-lg">
          {platform === "windows" && phrases.windowsLangSupportDetail[lang]}
          {platform === "macos" && phrases.macOSLangSupportDetail[lang]}
          {platform === "ios" && phrases.IOSLangSupportDetail[lang]}
          {platform === "android" && phrases.AndroidLangSupportDetail[lang]}
        </p>

        {/* Images */}
        {available && images.length > 0 && (
          <div className="flex flex-col gap-4 w-full max-w-3xl">
            {images.map((image, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative w-full h-auto">
                  <Image
                    src={image}
                    alt={`${title} keyboard layout ${index + 1}`}
                    width={800}
                    height={400}
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "400px",
                      objectFit: "contain"
                    }}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Coming Soon Preview */}
        {!available && (
          <Card className="w-full max-w-2xl opacity-70">
            <CardContent className="text-center py-16">
              <h3 className="text-xl text-gray-600 mb-2">
                🚧 {phrases.underDev[lang]}
              </h3>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {available && (
          <div className="flex flex-col sm:flex-row gap-4">
            {downloadUrl && (
              <>
                {platform === "android" ? (
                  <button
                    onClick={handleDownload}
                    aria-label="Download Kalasha Ala Keyboard from Google Play"
                    className="border-none bg-transparent cursor-pointer p-0 h-14 min-w-40 flex items-center justify-center hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src={lang === "en"
                        ? "/buttons/GetItOnGooglePlay_Badge_Web_color_English.svg"
                        : "/buttons/GetItOnGooglePlay_Badge_Web_color_Persian.svg"
                      }
                      alt=""
                      width={200}
                      height={56}
                      style={{ width: "auto", height: "56px" }}
                    />
                  </button>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<Download className="w-5 h-5" />}
                    onClick={handleDownload}
                    className="min-w-40 py-3"
                  >
                    {phrases.download[lang]}
                  </Button>
                )}
              </>
            )}

            {guideUrl && (
              <Button
                variant="outlined"
                size="large"
                endIcon={<BookOpen className="w-5 h-5" />}
                onClick={handleGuide}
                className="min-w-40 h-14 py-3"
              >
                {phrases.installationGuide[lang]}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Page component for the technology section of the website.
 *
 * Displays a page with a heading, intro text, and a tabbed section for
 * each keyboard platform. Each tabbed section contains a title, available
 * status, images, download link, and installation guide link.
 *
 * @returns {React.ReactElement} - The Page component
 */
const Page: React.FC = () => {
  const {
    keyboards,
    downloadKeyboardText,
    download,
    installationGuide,
    windows,
    macos,
    ios,
    android,
    comingSoon,
    availableNow,
    langSupport,
    langSupportDetail,
    windowsLangSupportDetail,
    macOSLangSupportDetail,
    underDev,
    IOSLangSupportDetail,
    AndroidLangSupportDetail,
  } = phrases as PhrasesType;

  const [isClient, setIsClient] = useState(false);
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");
  const [tabValue, setTabValue] = useState(0);
  const { state } = useAppContext();
  const { language: lang } = state;
  const searchParams = useSearchParams();
  
  useEffect(() => {
    setIsClient(true);
    setDir(lang === "en" ? "ltr" : "rtl");
  }, [lang]);

  useEffect(() => {
    const platform = searchParams.get("platform");
    if (platform === "android") {
      setTabValue(3); // Android tab index
    } else if (platform === "windows") {
      setTabValue(0);
    } else if (platform === "macos") {
      setTabValue(1);
    } else if (platform === "ios") {
      setTabValue(2);
    }
  }, [searchParams]);

/**
 * Handles tab change event by updating the tab value state.
 *
 * @param {React.SyntheticEvent} _event - Synthetic event object.
 * @param {number} newValue - The new tab value.
 */
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Keyboard configurations
  const keyboardConfigs = [
    {
      platform: "windows" as const,
      title: windows[lang],
      icon: <Laptop className="w-6 h-6" />,
      available: true,
      images: [
        "/keyboardImages/Keyboard.jpg",
        "/keyboardImages/Keyboard_shift.jpg",
      ],
      downloadUrl: "/keyboard/kalasha.zip",
      guideUrl: `/guides/Installation_Guide_${lang}.pdf`,
    },
    {
      platform: "macos" as const,
      title: macos[lang],
      icon: <Laptop className="w-6 h-6" />,
      available: false,
      images: [],
      downloadUrl: undefined,
      guideUrl: undefined,
    },
    {
      platform: "ios" as const,
      title: ios[lang],
      icon: <Smartphone className="w-6 h-6" />,
      available: false,
      images: [],
      downloadUrl: undefined,
      guideUrl: undefined,
    },
    {
      platform: "android" as const,
      title: android[lang],
      icon: <Smartphone className="w-6 h-6" />,
      available: true,
      images: ["/keyboardImages/Android_keyboard.jpg",
      "/keyboardImages/Android_keyboard_shift.jpg"
      ],
      downloadUrl: "https://play.google.com/store/apps/details?id=com.kalasha.keyboard.ala",
      guideUrl: "https://www.youtube.com/shorts/0Q3OJN_qJew",
    },
  ];

  // if (loadingPage) {
  //   return <LoadingPage />;
  // }

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto mt-4 sm:mt-8 md:mt-16 mb-8 flex flex-col justify-center">
        <div className="text-center mb-8">
          <h1
            className={`${
              lang === "en" ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"
            } font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2`}
          >
            {keyboards[lang]}
          </h1>
          <p
            className={`${
              lang === "en" ? "text-md" : "text-2xl"
            }   text-gray-600`}
          >
            {downloadKeyboardText[lang]}
          </p>
        </div>
        <div
          className="w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          dir={dir}
        >
          {/* Header */}
          <div className="p-6 sm:p-8 md:p-12 pb-4">
            <Alert severity="info" className="mb-6">
              <div className="mb-2">
                <strong
                  className={
                    lang === "en" ? "text-lg" : "text-2xl"
                  }
                >
                  {langSupport[lang]}
                </strong>
              </div>
              <p className={`${lang === "en" ? "text-sm" : "text-lg"}`}>
                {langSupportDetail[lang]}
              </p>
            </Alert>
          </div>

          {/* Platform Tabs */}
          <div className="border-b border-gray-200">
            <div className="grid grid-cols-4">
              {keyboardConfigs.map((config, index) => (
                <button
                  key={config.platform}
                  onClick={() => setTabValue(index)}
                  id={`keyboard-tab-${index}`}
                  aria-controls={`keyboard-tabpanel-${index}`}
                  aria-selected={tabValue === index}
                  className={`flex flex-col items-center justify-center min-h-[72px] py-3 px-2 transition-colors ${
                    tabValue === index
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="mb-1">{config.icon}</div>
                  <span className="text-sm font-medium">{config.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Panels */}
          {keyboardConfigs.map((config, index) => (
            <TabPanel key={config.platform} value={tabValue} index={index}>
              <KeyboardComponent
                platform={config.platform}
                title={config.title}
                available={config.available}
                images={config.images}
                downloadUrl={config.downloadUrl}
                guideUrl={config.guideUrl}
                lang={lang}
                phrases={{
                  keyboards,
                  downloadKeyboardText,
                  download,
                  installationGuide,
                  windows,
                  macos,
                  ios,
                  android,
                  comingSoon,
                  availableNow,
                  langSupport,
                  langSupportDetail,
                  windowsLangSupportDetail,
                  macOSLangSupportDetail,
                  underDev,
                  IOSLangSupportDetail,
                  AndroidLangSupportDetail,
                }}
              />
            </TabPanel>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
