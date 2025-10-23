'use client';

import {
  Box,
  Container,
  Grid2 as Grid,
  Divider,
  TextField,
  Card,
  CardContent,
} from "@mui/material";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { StripeCheckout } from "./StripeCheckout";
import { UIButton } from "./ui/Button";
import { UITypography } from "./ui/Typography";
import { InputMask, type InputMaskProps } from "@react-input/mask";
import { BrowserView, MobileView, isBrowser } from "react-device-detect";
import axios from "axios";

// Component with InputMask
const ForwardedInputMask = forwardRef<HTMLInputElement, InputMaskProps>(
  (props, forwardedRef) => {
    return (
      <InputMask
        ref={forwardedRef}
        mask="###-###-####"
        replacement="#"
        {...props}
      />
    );
  }
);

ForwardedInputMask.displayName = "ForwardedInputMask";

export const Checkout = () => {
  const [mobilePhone, setMobilePhone] = useState("");
  const [email, setEmail] = useState("");
  const [isValidating, setIsValidating] = useState<boolean>(false);

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Remove all non-numeric characters
    const numbersOnly = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limitedNumbers = numbersOnly.slice(0, 10);
    
    // Format as ###-###-####
    let formatted = '';
    if (limitedNumbers.length > 0) {
      formatted = limitedNumbers.slice(0, 3);
      if (limitedNumbers.length > 3) {
        formatted += '-' + limitedNumbers.slice(3, 6);
      }
      if (limitedNumbers.length > 6) {
        formatted += '-' + limitedNumbers.slice(6, 10);
      }
    }
    
    setMobilePhone(formatted);
  };

  const [paymentMethod, setPaymentMethod] = useState<string>();

  const isInvalidPhone = useMemo(() => {
    return (
      !mobilePhone ||
      !mobilePhone.match(/^\d{3}-\d{3}-\d{4}$/)
    );
  }, [mobilePhone]);

  const isInvalidEmail = useMemo(() => {
    return !email || !email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
  }, [email]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [postCard, setPostCard] = useState<any>(null);

  const onContinueToPayment = () => {
    if (isInvalidPhone || isInvalidEmail) {
      setIsValidating(true);
      return;
    }
    setIsValidating(false);
    setPaymentMethod("stripe");
    localStorage.setItem("customerEmail", email);
    localStorage.setItem("customerPhone", mobilePhone);
  };

  const loadPostCard = async () => {
    try {
      const postCardId = localStorage.getItem("postCardId");

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/post-cards/${postCardId}`
      );

      setPostCard(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isBrowser) {
      loadPostCard();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBrowser]);

  const frontImageSrc = useMemo(() => {
    if (postCard) {
      const previewUrl = localStorage.getItem("previewFrontUrl");
      if (!previewUrl) return "";
      const sep = previewUrl.includes("?") ? "&" : "?";
      return `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/${previewUrl}${sep}cb=${Date.now()}`;
    }
    return "";
  }, [postCard]);

  const backImageSrc = useMemo(() => {
    if (postCard) {
      return `${process.env.NEXT_PUBLIC_S3_ENDPOINT}/postCards/${postCard.id}/back.jpg?cb=${Date.now()}`;
    }
    return "";
  }, [postCard]);

  const address = useMemo(() => {
    if (postCard) {
      return JSON.parse(postCard.address);
    }

    return {};
  }, [postCard]);

  if (isBrowser && !postCard) {
    return null;
  }

  return (
    <>
      <MobileView>
        <Container>
          {!paymentMethod && (
            <Box>
              <Box
                sx={{
                  borderRadius: 1,
                  backgroundColor: "#FFFCF2",
                  boxShadow: "0px 6px 24px -10px #00000040",
                  textAlign: "left",
                  padding: 2,
                  marginBottom: 3,
                }}
              >
                <UITypography fontSize={32} marginBottom={1}>
                  Summary
                </UITypography>
                <Grid container spacing={1}>
                  <Grid size={10}>
                    <UITypography
                      fontFamily={"Quicksand"}
                      color="#00000080"
                      fontSize={18}
                    >
                      Premium Postcard
                    </UITypography>
                  </Grid>
                  <Grid size={2} sx={{ textAlign: "right" }}>
                    <UITypography fontFamily={"Quicksand"} fontSize={18}>
                      $10
                    </UITypography>
                  </Grid>

                  <Grid size={10}>
                    <UITypography
                      fontFamily={"Quicksand"}
                      color="#00000080"
                      fontSize={18}
                    >
                      Postage
                    </UITypography>
                  </Grid>
                  <Grid size={2} sx={{ textAlign: "right" }}>
                    <UITypography fontFamily={"Quicksand"} fontSize={18}>
                      $.56
                    </UITypography>
                  </Grid>

                  <Grid size={10}>
                    <UITypography
                      fontFamily={"Quicksand"}
                      color="#00000080"
                      fontSize={18}
                    >
                      Taxes and Service Fee
                    </UITypography>
                  </Grid>
                  <Grid size={2} sx={{ textAlign: "right" }}>
                    <UITypography fontFamily={"Quicksand"} fontSize={18}>
                      $.68
                    </UITypography>
                  </Grid>
                </Grid>

                <Divider sx={{ marginTop: 1 }} />

                <Grid container marginTop={1}>
                  <Grid size={8}>
                    <UITypography fontSize={32}>Total</UITypography>
                  </Grid>
                  <Grid size={4} sx={{ textAlign: "right" }}>
                    <UITypography fontSize={32}>$11.24</UITypography>
                  </Grid>
                </Grid>
              </Box>

              <Box>
                <Box
                  sx={{
                    backgroundColor: "#F6F2E7",
                    paddingY: 3,
                    paddingX: 3,
                    borderRadius: "4px",
                  }}
                >
                  <Grid container spacing={1}>
                    <Grid size={12}>
                      <TextField
                        error={isValidating && isInvalidPhone}
                        InputProps={{
                          inputComponent: ForwardedInputMask,
                        }}
                        fullWidth
                        sx={{
                          background: "white",
                        }}
                        id="mobile-phone-field"
                        label="Mobile Number (Required)"
                        variant="outlined"
                        size="small"
                        value={mobilePhone}
                        onChange={handlePhoneChange}
                      />
                    </Grid>
                    <Grid size={12}>
                      <TextField
                        error={isValidating && isInvalidEmail}
                        fullWidth
                        sx={{
                          background: "white",
                        }}
                        id="email-field"
                        label="Email (Required)"
                        variant="outlined"
                        size="small"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ marginTop: 3 }}>
                    <UIButton
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      sx={{
                        width: 242,
                      }}
                      onClick={onContinueToPayment}
                    >
                      <UITypography fontSize={22}>
                        Continue to Payment
                      </UITypography>
                    </UIButton>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {paymentMethod === "stripe" && (
            <Box
              sx={{
                backgroundColor: "#F6F2E7",
                paddingY: 3,
                paddingX: 3,
                borderRadius: "4px",
              }}
            >
              <StripeCheckout email={email} />
            </Box>
          )}
        </Container>
      </MobileView>
      <BrowserView>
        <Container
          maxWidth={false}
          sx={{ paddingX: "10% !important", marginTop: 10 }}
        >
          <Grid container spacing={3}>
            <Grid size={8}>
              <Grid container>
                <Box
                  gap={1}
                  sx={{
                    display: "flex",
                    backgroundColor: "#F6F2E7",
                    width: "100%",
                    height: "100%",
                    padding: 2,
                    borderRadius: "9px",
                  }}
                >
                  <Grid size={4}>
                    <Box
                      component="img"
                      sx={{
                        aspectRatio: 1.5,
                        height: { xs: 200 },
                        width: { xs: 300 },
                        boxShadow: "1.5px 2px 3px 0px #00000026",
                      }}
                      src={frontImageSrc!}
                    />
                  </Grid>
                  <Grid size={4}>
                    <Box
                      component="img"
                      sx={{
                        aspectRatio: 1.5,
                        height: { xs: 200 },
                        width: { xs: 300 },
                        boxShadow: "1.5px 2px 3px 0px #00000026",
                      }}
                      src={backImageSrc!}
                    />
                  </Grid>
                  <Grid size={4}>
                    <Card
                      sx={{
                        boxShadow: '0px 5px 19px -8px #00000040',
                        borderRadius: '16px'
                      }}
                    >
                      <CardContent sx={{ textAlign: "left", padding: 3 }}>
                        <UITypography
                          fontSize={16}
                          fontFamily={"Quicksand"}
                          marginBottom={1}
                        >
                          1 Premium Postcard
                        </UITypography>
                        <UITypography
                          color="#00000080"
                          fontSize={16}
                          fontFamily={"Quicksand"}
                          marginBottom={3}
                        >
                          Going to:
                        </UITypography>
                        <UITypography
                          fontSize={16}
                          fontFamily={"Quicksand"}
                          marginBottom={1}
                        >
                          {address.name}
                        </UITypography>
                        <UITypography
                          fontSize={16}
                          fontFamily={"Quicksand"}
                          marginBottom={1}
                        >
                          {address.street}
                        </UITypography>
                        <UITypography
                          fontSize={16}
                          fontFamily={"Quicksand"}
                          marginBottom={1}
                        >
                          {address.city}, {address.state} {address.zip}
                        </UITypography>

                        <Divider />
                      </CardContent>
                    </Card>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
            <Grid size={4}>
              {!paymentMethod && (
                <Box>
                  <Box
                    sx={{
                      borderRadius: '20px',
                      backgroundColor: "#FFFCF2",
                      boxShadow: "0px 6px 24px -10px #00000040",
                      textAlign: "left",
                      padding: 3,
                      marginBottom: 3,
                    }}
                  >
                    <UITypography fontSize={32} marginBottom={1}>
                      Summary
                    </UITypography>
                    <Grid container spacing={1}>
                      <Grid size={10}>
                        <UITypography
                          fontFamily={"Quicksand"}
                          color="#00000080"
                          fontSize={18}
                        >
                          Premium Postcard
                        </UITypography>
                      </Grid>
                      <Grid size={2} sx={{ textAlign: "right" }}>
                        <UITypography fontFamily={"Quicksand"} fontSize={18}>
                          $10
                        </UITypography>
                      </Grid>

                      <Grid size={10}>
                        <UITypography
                          fontFamily={"Quicksand"}
                          color="#00000080"
                          fontSize={18}
                        >
                          Postage
                        </UITypography>
                      </Grid>
                      <Grid size={2} sx={{ textAlign: "right" }}>
                        <UITypography fontFamily={"Quicksand"} fontSize={18}>
                          $.56
                        </UITypography>
                      </Grid>

                      <Grid size={10}>
                        <UITypography
                          fontFamily={"Quicksand"}
                          color="#00000080"
                          fontSize={18}
                        >
                          Taxes and Service Fee
                        </UITypography>
                      </Grid>
                      <Grid size={2} sx={{ textAlign: "right" }}>
                        <UITypography fontFamily={"Quicksand"} fontSize={18}>
                          $.68
                        </UITypography>
                      </Grid>
                    </Grid>

                    <Divider sx={{ marginY: 2 }} />

                    <Grid container marginTop={1}>
                      <Grid size={8}>
                        <UITypography fontSize={32}>Total</UITypography>
                      </Grid>
                      <Grid size={4} sx={{ textAlign: "right" }}>
                        <UITypography fontSize={32}>$11.24</UITypography>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box>
                    <Box
                      sx={{
                        backgroundColor: "#F6F2E7",
                        paddingY: 3,
                        paddingX: 3,
                        borderRadius: "9px",
                      }}
                    >
                      <Grid container spacing={1}>
                        <Grid size={12}>
                          <TextField
                            error={isValidating && isInvalidPhone}
                            InputProps={{
                              inputComponent: ForwardedInputMask,
                            }}
                            fullWidth
                            sx={{
                              background: "white",
                            }}
                            id="mobile-phone-field"
                            label="Mobile Number (Required)"
                            variant="outlined"
                            size="small"
                            value={mobilePhone}
                            onChange={handlePhoneChange}
                          />
                        </Grid>
                        <Grid size={12}>
                          <TextField
                            error={isValidating && isInvalidEmail}
                            fullWidth
                            sx={{
                              background: "white",
                            }}
                            id="email-field"
                            label="Email (Required)"
                            variant="outlined"
                            size="small"
                            value={email}
                            onChange={(event) => {
                              setEmail(event.target.value);
                            }}
                          />
                        </Grid>
                      </Grid>

                      <Box sx={{ marginTop: 3 }}>
                        <UIButton
                          component="label"
                          role={undefined}
                          variant="contained"
                          tabIndex={-1}
                          sx={{
                            width: 242,
                          }}
                          onClick={onContinueToPayment}
                        >
                          <UITypography fontSize={22}>
                            Continue to Payment
                          </UITypography>
                        </UIButton>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}

              {paymentMethod === "stripe" && (
                <Box
                  sx={{
                    backgroundColor: "#F6F2E7",
                    paddingY: 3,
                    paddingX: 3,
                    borderRadius: "4px",
                  }}
                >
                  <StripeCheckout email={email} />
                </Box>
              )}
            </Grid>
          </Grid>
        </Container>
      </BrowserView>
    </>
  );
};
