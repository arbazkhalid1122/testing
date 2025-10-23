'use client';

import { Box, Container } from "@mui/material";
import MailboxPng from "../assets/images/mailbox.svg";
import { useEffect, useState } from "react";
import axios from "axios";
import { UITypography } from "./ui/Typography";
import { UIButton } from "./ui/Button";
import { isBrowser } from "react-device-detect";
import { useSetSearchParams } from "@/hooks/useSetSearchParams";
import { useRouter } from "next/navigation";
import Image from "next/image";

export const padOrderID = (num: number) => {
  let numStr = num.toString();
  while (numStr.length < 9) numStr = "0" + numStr;
  return numStr;
};

export const CheckoutSuccess = () => {
  const [isLoaded, setIsloaded] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [order, setOrder] = useState<any>();
  const router = useRouter();

  const [searchParams] = useSetSearchParams();
  const paymentIntent = searchParams.get("payment_intent");

  const generateOrder = async () => {
    try {
      const postCardId = localStorage.getItem("postCardId");
      const customerEmail = localStorage.getItem("customerEmail");
      const customerPhone = localStorage.getItem("customerPhone");

      if (!postCardId) {
        window.location.href = "/";
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/orders?paymentIntent=${paymentIntent}`,
        {
          postCardId: postCardId,
          customerEmail: customerEmail,
          customerPhone: customerPhone,
        }
      );
      setOrder(res.data);

      setIsloaded(true);
      localStorage.removeItem("postCardId");
      localStorage.removeItem("customerEmail");
      localStorage.removeItem("customerPhone");
      localStorage.removeItem("previewFrontUrl");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    generateOrder();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isLoaded || !order) {
    return null;
  }

  return (
    <Container
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Box
        sx={{
          backgroundColor: "#FFFCF2",
          boxShadow: "0px 6px 24px -10px #00000040",
          paddingY: isBrowser ? 0 : 3,
          paddingX: isBrowser ? 0 : 2,
          width: isBrowser ? 572 : "auto",
          borderRadius: "24px",
        }}
      >
        <Box sx={{ paddingX: isBrowser ? 12 : 0, paddingY: isBrowser ? 6 : 0 }}>
          <UITypography fontSize={32} fontWeight={600}>
            Purchase Confirmed
          </UITypography>
          <Box sx={{ marginY: 3, display: 'flex', justifyContent: 'center' }}>
            <Image 
              src={MailboxPng} 
              alt="Mailbox"
              width={200}
              height={200}
            />
          </Box>
          <Box sx={{ paddingX: 3 }}>
            <UITypography
              fontFamily={"Quicksand"}
              fontSize={isBrowser ? 24 : 20}
              sx={{ marginBottom: 3 }}
              fontWeight={600}
            >
              An email receipt will be emailed to you shortly.
            </UITypography>
            <UITypography
              fontFamily={"Quicksand"}
              fontSize={isBrowser ? 16 : 14}
              fontWeight="400"
              sx={{ marginBottom: isBrowser ? 3 : 1 }}
            >
              Your order number is #{padOrderID(order.id)}
            </UITypography>
            <UITypography
              fontFamily={"Quicksand"}
              fontSize={14}
              fontWeight="bold"
            >
              We&apos;re reviewing your card and will mail it out as soon as it is
              ready.
            </UITypography>

            <UIButton
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              sx={{
                marginTop: isBrowser ? 3 : 2,
                width: "100%",
              }}
              onClick={() => router.push("/")}
            >
              <UITypography
                sx={{
                  fontSize: 22,
                  fontWeight: 600,
                }}
              >
                Mail Another Postcard
              </UITypography>
            </UIButton>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};
