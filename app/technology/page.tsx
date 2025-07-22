"use client";
import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Box,
  Button,
  Stack,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Alert,
  AlertTitle,
} from "@mui/material";
import {
  Computer as WindowsIcon,
  Apple as AppleIcon,
  PhoneIphone as IPhoneIcon,
  Android as AndroidIcon,
  Download as DownloadIcon,
  MenuBook as GuideIcon,
} from "@mui/icons-material";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
// import LoadingPage from "@/app/loading";
import { phrases } from "@/utils/i18n";

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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
    <Box>
      <Stack spacing={3} alignItems="center">
        {/* Status Chip */}
        <Chip
          label={
            available ? phrases.availableNow[lang] : phrases.comingSoon[lang]
          }
          color={available ? "success" : "warning"}
          variant="filled"
          size="medium"
        />

        {/* Platform Description */}
        <Typography variant="body1" textAlign="center" color="text.secondary">
          {platform === "windows" && phrases.windowsLangSupportDetail[lang]}
          {platform === "macos" && phrases.macOSLangSupportDetail[lang]}
          {platform === "ios" && phrases.IOSLangSupportDetail[lang]}
          {platform === "android" && phrases.AndroidLangSupportDetail[lang]}
        </Typography>

        {/* Images */}
        {available && images.length > 0 && (
          <Stack spacing={2} sx={{ width: "100%", maxWidth: 1000 }}>
            {images.map((image, index) => (
              <Card key={index} elevation={3}>
                <CardMedia
                  component={Image}
                  image={image}
                  alt={`${title} keyboard layout ${index + 1}`}
                  width={1000}
                  height={300}
                  style={{ objectFit: "cover" }}
                />
              </Card>
            ))}
          </Stack>
        )}

        {/* Coming Soon Preview */}
        {!available && (
          <Card
            elevation={2}
            sx={{ width: "100%", maxWidth: 600, opacity: 0.7 }}
          >
            <CardContent sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                🚧 {phrases.underDev[lang]}
              </Typography>
              
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {available && (
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            {downloadUrl && (
              <Button
                variant="contained"
                size="large"
                endIcon={<DownloadIcon />}
                onClick={handleDownload}
                sx={{
                  minWidth: 160,
                  borderRadius: 2,
                  textTransform: "none",
                  py: 1.5,
                }}
              >
                {phrases.download[lang]}
              </Button>
            )}

            {guideUrl && (
              <Button
                variant="outlined"
                size="large"
                endIcon={<GuideIcon />}
                onClick={handleGuide}
                sx={{
                  minWidth: 160,
                  borderRadius: 2,
                  textTransform: "none",
                  py: 1.5,
                }}
              >
                {phrases.installationGuide[lang]}
              </Button>
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

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

  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");
  const [tabValue, setTabValue] = useState(0);
  const { state } = useAppContext();
  const { language: lang } = state;

  useEffect(() => {
    setDir(lang === "en" ? "ltr" : "rtl");
  }, [lang]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Keyboard configurations
  const keyboardConfigs = [
    {
      platform: "windows" as const,
      title: windows[lang],
      icon: <WindowsIcon />,
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
      icon: <AppleIcon />,
      available: false,
      images: [],
      downloadUrl: undefined,
      guideUrl: undefined,
    },
    {
      platform: "ios" as const,
      title: ios[lang],
      icon: <IPhoneIcon />,
      available: false,
      images: [],
      downloadUrl: undefined,
      guideUrl: undefined,
    },
    {
      platform: "android" as const,
      title: android[lang],
      icon: <AndroidIcon />,
      available: false,
      images: [],
      downloadUrl: undefined,
      guideUrl: undefined,
    },
  ];

  // if (loadingPage) {
  //   return <LoadingPage />;
  // }

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: { xs: 2, sm: 4, md: 8 },
        mb: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
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
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: 3,
          overflow: "hidden",
        }}
        dir={dir}
      >
        {/* Header */}
        <Box sx={{ p: { xs: 3, sm: 4, md: 6 }, pb: 2 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <AlertTitle
              sx={
                lang === "en" ? { fontSize: "1.2rem" } : { fontSize: "1.5rem" }
              }
            >
              {langSupport[lang]}
            </AlertTitle>
            <p className={`${lang==="en"?"text-sm":"text-lg"}`}>{langSupportDetail[lang]}</p>
          </Alert>
        </Box>

        {/* Platform Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            aria-label="keyboard platform tabs"
            sx={{
              "& .MuiTab-root": {
                minHeight: 72,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
              },
            }}
          >
            {keyboardConfigs.map((config, index) => (
              <Tab
                key={config.platform}
                icon={config.icon}
                label={config.title}
                iconPosition="top"
                id={`keyboard-tab-${index}`}
                aria-controls={`keyboard-tabpanel-${index}`}
              />
            ))}
          </Tabs>
        </Box>

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
      </Paper>
    </Container>
  );
};

export default Page;
