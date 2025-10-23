'use client';

import { Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

import { PaymentElement } from "@stripe/react-stripe-js";
import { Box, Divider, Grid2 as Grid, Typography } from "@/lib/mui-optimized";

import PoweredByStripePng from "../assets/images/powered-by-stripe.png";
import { UIButton } from "./ui/Button";
import { UITypography } from "./ui/Typography";
import Image from "next/image";

// Validate Stripe key before initialization
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PK;
if (!stripeKey) {
  throw new Error("Stripe publishable key is not set. Please check your environment variables.");
}
const stripePromise = loadStripe(stripeKey);

const CheckoutForm = ({ clientSecret }: { clientSecret: string}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    await elements.submit();

    const result = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/checkout-success`,
      },
    });

    console.log(result)

    if (result.error) {
      console.log(result.error.message);
    } else {
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <PaymentElement />

      <Divider sx={{ marginY: 2 }} />

      <Grid container marginBottom={2}>
        <Grid size={8} sx={{ textAlign: "left" }}>
          <Typography fontSize={24}>Total</Typography>
        </Grid>
        <Grid size={4} sx={{ textAlign: "right" }}>
          <Typography fontSize={24}>$11.24</Typography>
        </Grid>
      </Grid>

      <UIButton
        type="submit"
        disabled={!stripe}
        role={undefined}
        variant="contained"
        tabIndex={-1}
        sx={{
          height: 40,
          width: '100%',
          marginBottom: 1
        }}
      >
        <UITypography fontSize={22}>
          Place Order
        </UITypography>
      </UIButton>

      <Box>
        <UITypography fontFamily={"Quicksand"} fontSize={12}>
          Guaranteed <strong>safe and secure</strong> checkout
        </UITypography>
        <Box sx={{ marginLeft: 1, height: 20 }}>
          <Image
            src={PoweredByStripePng}
            alt="Powered by Stripe"
            width={80}
            height={20}
          />
        </Box>
      </Box>
    </Box>
  );
};

export const StripeCheckout = ({ email }: { email: string }) => {
  const [clientSecret, setClientSecret] = useState<string>();
  const getClientSecret = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/orders/stripe-client`,
        {
          amount: 11.24,
          email: email,
        }
      );

      const resData = res.data;
      setClientSecret(resData.client_secret);
    } catch (error) {
      console.error(error);
    }
  };

  const stripeOptions = useMemo(() => {
    if (clientSecret) {
      return {
        clientSecret: clientSecret,
      };
    }
    return null;
  }, [clientSecret]);

  useEffect(() => {
    getClientSecret();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!stripeOptions) {
    return null;
  }

  return (
    <Elements stripe={stripePromise} options={stripeOptions}>
      <CheckoutForm clientSecret={clientSecret !== undefined ? clientSecret : ""} />
    </Elements>
  );
};
