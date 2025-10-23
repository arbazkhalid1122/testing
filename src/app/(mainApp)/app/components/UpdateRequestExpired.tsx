'use client';

import { Box, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSetSearchParams } from "@/hooks/useSetSearchParams";

export const padOrderID = (num: number) => {
  let numStr = num.toString();
  while (numStr.length < 9) numStr = "0" + numStr;
  return numStr;
};

export const UpdateRequestExpired = () => {
  const [isLoaded, setIsloaded] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [order, setOrder] = useState<any>();
  const [expirationReason, setExpirationReason] = useState<string>('URL expired');

  const [searchParams] = useSetSearchParams();
  const token = searchParams.get("token");
  const reason = searchParams.get("reason");

  const getPostCardData = async (token: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/orders/order-by-token?token=${token}`
      );
      const updateRequest = response.data;
      const order = updateRequest.order;

      setOrder(order);
      setIsloaded(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) {
      getPostCardData(token);
    }
    if (reason) {
      setExpirationReason(decodeURIComponent(reason));
    }
  }, [token, reason]);

  const getExpirationMessage = () => {
    switch (expirationReason) {
      case 'URL already used':
        return `The URL for Order Number ${padOrderID(order.id)} has already been used to submit changes. Please contact support@printyourtrip.com to request a new URL and kindly reference your order number ${padOrderID(order.id)} in the email.`;
      case 'Order archived':
        return `The URL for Order Number ${padOrderID(order.id)} is no longer valid because the order has been archived. Please contact support@printyourtrip.com to request a new URL and kindly reference your order number ${padOrderID(order.id)} in the email.`;
      case 'URL expired':
      default:
        return `The URL you are trying to access Order Number ${padOrderID(order.id)} has expired. Please contact the support@printyourtrip.com to request a new URL and kindly reference your order number ${padOrderID(order.id)} in the email.`;
    }
  };

  if (!isLoaded || !order) {
    return null;
  }

  return (
    <Container sx={{ padding: 10, width: "50%" }}>
      <Box
        sx={{
          backgroundColor: "#FFFCF2",
          boxShadow: "0px 6px 24px -10px #00000040",
          paddingY: 8,
          paddingX: 8,
        }}
      >
        <Box sx={{ paddingX: 3 }}>
          <Typography fontWeight={800} fontSize={20} sx={{ marginBottom: 3 }}>
            {getExpirationMessage()}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};
