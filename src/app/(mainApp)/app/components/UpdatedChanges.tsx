'use client';

import { Box, Button, Container, Typography } from "@mui/material";
import MailboxPng from "../assets/images/mailbox.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSetSearchParams } from "@/hooks/useSetSearchParams";
import { useRouter } from "next/navigation";
import Image from "next/image";

export const padOrderID = (num: number) => {
  let numStr = num.toString();
  while (numStr.length < 9) numStr = "0" + numStr;
  return numStr;
};

export const UpdatedChanges = () => {
  const [isLoaded, setIsloaded] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [order, setOrder] = useState<any>();
  const router = useRouter();

  const [searchParams] = useSetSearchParams();
  const token = searchParams.get("token");

  const getPostCardData = async (token: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/orders/order-by-token?token=${token}`
      );
      const updateRequest = response.data;
      const order = updateRequest.order;

      setOrder(order);
      setIsloaded(true);

      // Mark the update request as used
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/orders/mark-update-request-used?token=${token}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token && token !== 'null') {
      getPostCardData(token);
    } else {
      console.error('Invalid or missing token:', token);
      router.push('/'); // Redirect to home if token is invalid
    }
  }, [token, router]);

  if (!isLoaded || !order) {
    return null;
  }

  return (
    <Container>
      <Box
        sx={{
          backgroundColor: "#FFFCF2",
          boxShadow: "0px 6px 24px -10px #00000040",
          paddingY: 3,
          paddingX: 2,
        }}
      >
        <Typography fontSize={28} fontWeight="bold">
          Changes Submitted
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", marginY: 3 }}>
          <Image
            src={MailboxPng}
            alt="Mailbox"
            width={200}
            height={200}
          />
        </Box>
        <Box sx={{ paddingX: 3 }}>
          <Typography fontSize={20} sx={{ marginBottom: 3 }}>
            An email receipt will be emailed to you shortly.
          </Typography>
          <Typography fontSize={14} fontWeight="400" sx={{ marginBottom: 1 }}>
            Your order number is #{padOrderID(order.id)}
          </Typography>
          <Typography fontSize={14} fontWeight="bold">
            We&apos;re reviewing your changes and will mail it out as soon as it is
            ready.
          </Typography>

          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            sx={{
              // fontFamily: 'League Spartan',
              borderRadius: 18,
              background: "#648A65",
              color: "#FFFCF2",
              paddingX: 3,
              paddingY: 2,
              marginTop: 3,
              marginBottom: 2,
              height: "54px",
            }}
            onClick={() => router.push("/")}
          >
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Mail Another Postcard
            </Typography>
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
