'use client';

import { Box, Card, CardContent } from "@mui/material";
import HeaderLogoFull from "../assets/images/header-logo-full.png";
import { BrowserView, MobileView } from "react-device-detect";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export const AppHeader = () => {
  const router = useRouter();
  const path = usePathname()


const handleBack = () => {
  if (path.includes("create")) {
    const shouldLeave = window.confirm("Changes you made may not be saved. Do you want to go back?");
    if (shouldLeave) {
      router.back();
    }
  } else {
    router.back();
  }
};


  return (
    <>
      <MobileView>
        <header
          style={{
            paddingTop: "5%",
            paddingLeft: "5%",
            paddingRight: "5%",
            marginBottom: 30,
          }}
        >
          <Card
            sx={{
              backgroundColor: "#FFFCF2",
              borderRadius: "50px",
              padding: 0,
              boxShadow: "0px 6px 24px -10px #00000040",
            }}
          >
            <CardContent
              sx={{
                justifyContent: "center",
                paddingBottom: "16px !important",
                display: "flex",
                position: "relative",
              }}
            >
              <ArrowBackIosRoundedIcon
                onClick={handleBack}
                sx={{
                  height: 27,
                  width: 27,
                  position: "absolute",
                  left: 30,
                  top: 25,
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  width={163}
                  height={44}
                  src={HeaderLogoFull}
                  alt="Header Logo"
                  style={{ width: "auto", height: "auto" }}
                />
              </Box>
            </CardContent>
          </Card>
        </header>
      </MobileView>
      <BrowserView>
        <header>
          <Box sx={{ padding: 3 }}>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "start",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  boxShadow: "0px 6px 24px -10px #00000040",
                  borderRadius: 100,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 3,
                  background: "#FFFCF2",
                }}
                onClick={handleBack}
              >
                <ArrowBackIosRoundedIcon
                  sx={{
                    height: 30,
                    width: 20,
                  }}
                />
              </Box>

              <Image
                width={224}
                height={60}
                src={HeaderLogoFull}
                alt="Header Logo"
                style={{ width: "auto", height: "auto" }}
              />
            </Box>
          </Box>
        </header>
      </BrowserView>
    </>
  );
};
