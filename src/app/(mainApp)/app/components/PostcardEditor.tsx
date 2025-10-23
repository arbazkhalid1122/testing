'use client';

import React from "react";
import {
  Box,
  Stack,
  Step,
  StepLabel,
  Stepper,
  styled,
  Container,
  StepIconProps,
  StepConnector,
  stepConnectorClasses,
  Grid2 as Grid,
  TextField,
  LinearProgress,
  linearProgressClasses,
  Autocomplete,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import MobileSamplePng from "../assets/images/main-editor-sample.jpg";
import BackDecalsPng from "../assets/images/back-with-decals.png";
import { makeStyles } from "@mui/styles";
import Textarea from "@mui/joy/Textarea";
import axios from "axios";
import CheckIcon from "@mui/icons-material/Check";
import { useRouter } from "next/navigation";
import { BrowserView, MobileView } from "react-device-detect";
import { padOrderID } from "./CheckoutSuccess";
import { UITypography } from "./ui/Typography";
import { UIButton } from "./ui/Button";
import { UIPostCardMessage } from "./ui/PostCardMessage";
import { isAndroidDevice } from "../utils/helpers";
import { useSetSearchParams } from "@/hooks/useSetSearchParams";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#648A65",
    ...theme.applyStyles("dark", {
      backgroundColor: "#308fe8",
    }),
  },
}));

const steps = ["Add Photo", "Add Message", "Add Address", "Review"];

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean; disabled?: boolean };
}>(({ theme }) => ({
  backgroundColor: "transparent",
  zIndex: 1,
  width: 30,
  height: 30,
  display: "flex",
  borderRadius: "50%",
  border: "2px solid #D7DDCB",
  justifyContent: "center",
  alignItems: "center",
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        border: "3px solid #648A65",
        color: "#648A65",
        "& p": {
          fontWeight: "bold",
        },
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        border: "3px solid #648A65",
        background: "#648A65",
        "& p": {
          fontWeight: "bold",
        },
      },
    },
    {
      props: ({ ownerState }) => ownerState.disabled,
      style: {
        opacity: 0.5,
        cursor: "not-allowed",
      },
    },
  ],
}));

const CompletedColorlibStepIconRoot = styled("div")<{
  ownerState: { active?: boolean };
}>(({ theme }) => ({
  backgroundColor: "#648A65",
  zIndex: 1,
  width: 30,
  height: 30,
  display: "flex",
  borderRadius: "50%",
  border: "3px solid #648A65",
  justifyContent: "center",
  alignItems: "center",
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        background: "transparent",
        border: "3px solid #648A65",
        color: "#648A65",
        "& p": {
          fontWeight: "bold",
        },
      },
    },
  ],
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement<unknown> } = {
    1: (
      <UITypography fontFamily={"Quicksand"} fontWeight={500} fontSize={12}>
        01
      </UITypography>
    ),
    2: (
      <UITypography fontFamily={"Quicksand"} fontWeight={500} fontSize={12}>
        02
      </UITypography>
    ),
    3: (
      <UITypography fontFamily={"Quicksand"} fontWeight={500} fontSize={12}>
        03
      </UITypography>
    ),
    4: (
      <UITypography fontFamily={"Quicksand"} fontWeight={500} fontSize={12}>
        04
      </UITypography>
    ),
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {completed ? (
        <CheckIcon sx={{ color: "#FFFFFF" }} />
      ) : (
        <>{icons[String(props.icon)]}</>
      )}
    </ColorlibStepIconRoot>
  );
}

function CompletedColorlibStepIcon(props: StepIconProps) {
  const { active, className } = props;

  const icons: { [index: string]: React.ReactElement<unknown> } = {
    1: (
      <UITypography fontFamily={"Quicksand"} fontWeight={500} fontSize={12}>
        01
      </UITypography>
    ),
    2: (
      <UITypography fontFamily={"Quicksand"} fontWeight={500} fontSize={12}>
        02
      </UITypography>
    ),
    3: (
      <UITypography fontFamily={"Quicksand"} fontWeight={500} fontSize={12}>
        03
      </UITypography>
    ),
    4: (
      <UITypography fontFamily={"Quicksand"} fontWeight={500} fontSize={12}>
        04
      </UITypography>
    ),
  };

  return (
    <CompletedColorlibStepIconRoot
      ownerState={{ active }}
      className={className}
    >
      {active ? (
        <>{icons[String(props.icon)]}</>
      ) : (
        <CheckIcon sx={{ color: "#FFFFFF" }} />
      )}
    </CompletedColorlibStepIconRoot>
  );
}

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 15,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: "#648A65",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: "#648A65",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#D7DDCB",
    borderRadius: 1,
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

const useStyles = makeStyles(() => ({
  step_label_root: {
    marginTop: "8px !important",
  },
  step_label_root_browser: {
    marginTop: "12px !important",
  },
}));

export const PostcardEditor = () => {
  const router = useRouter();
  const [searchParams, setSearchParams] = useSetSearchParams();
  const token = searchParams.get("token");
  const stepQs = searchParams.get("step");

  const [activeStep, setActiveStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const classes = useStyles();
  const [previewFileObject, setPreviewFileObject] = useState<string>();
  const [previewFrontUrl, setPreviewFrontUrl] = useState<string>();
  const [previewProcessing, setPreviewProcessing] = useState<boolean>(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File>();
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  }>();
  const [isLandscape, setIsLandscape] = useState<boolean>();
  const [message, setMessage] = useState<string>();
  const [address, setAddress] = useState({
    name: "",
    company: "",
    street: "",
    suite: "",
    city: "",
    state: "",
    zip: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUpdatingFromUrl, setIsUpdatingFromUrl] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [updateOrderRequest, setUpdateOrderRequest] = useState<any>(null);
  const [validatingAddress, setValidatingAddress] = useState<boolean>(false);
  const [allowStepperNavigation, setAllowStepperNavigation] = useState(false);
  const [isAndroid, setIsAndroid] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const charLimit = 400;
  const lineLimit = 9;
  const wrapWidth = 60; 

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);


  useEffect(() => {
    setIsAndroid(isAndroidDevice());
  }, []);

  useEffect(() => {
    localStorage.removeItem("previewFrontUrl")
    localStorage.removeItem("current-image-filename")
    localStorage.removeItem("customerEmail")
    localStorage.removeItem("customerPhone")
    localStorage.removeItem("postCardId")
  }, [])

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    let input = event.target.value;

    // Break into logical lines
    const lines = input.split("\n");

    // Convert long lines into wrapped lines
    const visualLines = lines.flatMap(line => {
      const chunks = [];
      for (let i = 0; i < line.length; i += wrapWidth) {
        chunks.push(line.slice(i, i + wrapWidth));
      }
      return chunks.length ? chunks : [""];
    });

    // Enforce line limit (based on visual lines)
    if (visualLines.length > lineLimit) {
      // Cut excess visual lines
      const allowedText = visualLines.slice(0, lineLimit).join("\n");
      input = allowedText;
    }

    // Enforce total character limit
    if (input.length > charLimit) {
      input = input.slice(0, charLimit);
    }

    setMessage(input);
  };

  const getPostCardData = async (token: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/orders/order-by-token?token=${token}`
      );
      const updateRequest = response.data;

      if (updateRequest.expired) {
        // Handle different expiration reasons
        const reason = updateRequest.reason || 'URL expired';
        return router.push(`/expired-request?token=${token}&reason=${encodeURIComponent(reason)}`);
      }

      const order = updateRequest.order;
      const postCard = order.postCard;

      setIsUpdatingFromUrl(true);
      setUpdateOrderRequest(updateRequest);

      setMessage(postCard.message);
      setAddress(JSON.parse(postCard.address));
              setSearchParams(prev => ({ ...Object.fromEntries(prev), step: "3" }));
    } catch (error) {
      console.error(error);
    }
  };

  const getSavedPostCardData = async () => {
    try {
      const postCardId = localStorage.getItem("postCardId");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/post-cards/${postCardId}`
      );
      const postCard = response.data;

      setMessage(postCard.message);
      setAddress(JSON.parse(postCard.address));
      setPreviewFrontUrl(localStorage.getItem('previewFrontUrl')!);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const stepNumber = parseFloat(stepQs!);
    if (Number.isNaN(stepNumber)) {
      setActiveStep(0);
    } else {
      setActiveStep(stepNumber);
    }
  }, [stepQs]);

  useEffect(() => {
    if (localStorage.getItem("postCardId")) {
      getSavedPostCardData();
    }
  }, []);

  useEffect(() => {
    if (token && token !== 'null') {
      getPostCardData(token);
    } else if (token === 'null') {
      console.error('Invalid token received:', token);
      // Don't redirect here as this component can work without a token
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const onFilesSelected = async (files: FileList | File[] | null) => {
    if (files && files.length > 0) {
      const mFile = files[0];
      const imageBitmap = await createImageBitmap(mFile);
      const { width, height } = imageBitmap;

      setImageDimensions({ width, height });
      setSelectedImageFile(mFile);
      setPreviewFileObject(URL.createObjectURL(mFile));

      try {
        setPreviewProcessing(true);
        const formData = new FormData();

        formData.append("file", mFile);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/post-cards/render-preview-front`,
          {
            method: "POST",
            body: formData,
          }
        );
        const responseJson = await response.json();
        setPreviewFrontUrl(responseJson.previewUrl);
        setPreviewProcessing(false);
      } catch (err) {
        console.error(err);
        setPreviewProcessing(false);
      }

      if (width > height) {
        setSearchParams(prev => ({ ...Object.fromEntries(prev), step: "0.1" }));
        setIsLandscape(true);
      } else {
        setIsLandscape(false);
      }
    }
  };

  useEffect(() => {
    if (activeStep === 3) {
      if (localStorage.getItem("previewFrontUrl")) {
        setPreviewFrontUrl(localStorage.getItem("previewFrontUrl")!);
        setIsCompleted(true);
      }
      // Enable stepper navigation when user reaches step 3
      setAllowStepperNavigation(true);
    }
  }, [activeStep]);

  useEffect(() => {
    if (previewFrontUrl) {
      localStorage.setItem("previewFrontUrl", `${previewFrontUrl}`);
    }
  }, [previewFrontUrl]);

  const isImageTooSmall = useMemo(() => {
    if (imageDimensions) {
      return imageDimensions.width < 1800 && imageDimensions.height < 1200;
    }
  }, [imageDimensions]);

  const previewImageSrc = useMemo(() => {
    if (previewFrontUrl) {
      const bust = Date.now();
      const sep = previewFrontUrl.includes('?') ? '&' : '?';
      return `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/${previewFrontUrl}${sep}cb=${bust}`;
    }

    if (!previewFileObject) {
      if (isUpdatingFromUrl) {
        const bust = Date.now();
        return `${process.env.NEXT_PUBLIC_S3_ENDPOINT}/orders/${padOrderID(
          updateOrderRequest.orderId
        )}/original.jpg?cb=${bust}`;
      }

      return MobileSamplePng;
    }

    return previewFileObject;
  }, [previewFileObject, isUpdatingFromUrl, previewFrontUrl, updateOrderRequest]);

  const isValidImage = useMemo(() => {
    if (previewFileObject) {
      if (isLandscape && imageDimensions && !isImageTooSmall) {
        return true;
      }

      return false;
    }

    return true;
  }, [previewFileObject, isImageTooSmall, imageDimensions, isLandscape]);

  const imageError = useMemo(() => {
    if (isValidImage) {
      return null;
    }

    if (!isLandscape) {
      return "Portrait photos are not supported. Please upload a photo with a landscape orientation.";
    }

    if (isImageTooSmall) {
      return "The photo is too low resolution. Please upload a higher-quality photo.";
    }

    return null;
  }, [isValidImage, isLandscape, isImageTooSmall]);

  const onSaveImage = async () => {
    if (selectedImageFile) {
      localStorage.setItem("current-image-filename", selectedImageFile.name);
      if (isCompleted) {
        setSearchParams(prev => ({ ...Object.fromEntries(prev), step: "3" }));
      } else {
        setSearchParams(prev => ({ ...Object.fromEntries(prev), step: "1" }));
      }
    }
  };

  const onSaveMessage = () => {
    if (isCompleted) {
      setSearchParams(prev => ({ ...Object.fromEntries(prev), step: "3" }));
    } else {
      setSearchParams(prev => ({ ...Object.fromEntries(prev), step: "2" }));
    }
  };

  const onSaveAddress = () => {
    if (isInvalidAddress) {
      setValidatingAddress(true);
      return;
    }
    setValidatingAddress(false);
    setSearchParams(prev => ({ ...Object.fromEntries(prev), step: "3" }));
    setIsCompleted(true);
  };

  const goToStepNavigation = () => {
    setAllowStepperNavigation(true);
    setSearchParams(prev => ({ ...Object.fromEntries(prev), step: "-1" }));
  };

  const isInvalidAddress = useMemo(() => {
    return (
      !address.name ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zip
    );
  }, [address]);

  // Address autocomplete function using Nominatim API
  const searchAddress = useCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&countrycodes=us,ca`
      );
      const data = await response.json();
      setAddressSuggestions(data);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setAddressSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback((query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      searchAddress(query);
    }, 300);
  }, [searchAddress]);

  // Function to fill address fields from selected suggestion
  const fillAddressFromSuggestion = useCallback((suggestion: any) => {
    const addressParts = suggestion.address;
    setAddress({
      name: address.name, // Keep existing name
      company: address.company, // Keep existing company
      street: addressParts.road ? `${addressParts.house_number || ''} ${addressParts.road}`.trim() : '',
      suite: address.suite, // Keep existing suite
      city: addressParts.city || addressParts.town || addressParts.village || '',
      state: addressParts.state || '',
      zip: addressParts.postcode || '',
    });
    setAddressSuggestions([]);
  }, [address.name, address.company, address.suite]);

  // const retriveLocalFile = async () => {
  //   const opfs = await navigator.storage.getDirectory();
  //   let nFile: File | null = null;
  //   const fileName = localStorage.getItem(`current-image-filename`);
  //   // @ts-ignore
  //   for await (const fileEntry of opfs.values()) {
  //     const fileHandle = await opfs.getFileHandle(fileEntry.name);
  //     if (fileEntry.name === fileName) {
  //       nFile = await fileHandle.getFile();
  //     } else {
  //       // @ts-ignore
  //       await fileHandle.remove();
  //     }
  //   }
  //   if (nFile) {
  //     setSelectedImageFile(nFile);
  //     setPreviewFileObject(URL.createObjectURL(nFile));
  //     onFilesSelected([nFile]);
  //   }
  //   return;
  // };

  useEffect(() => {
    if (localStorage.getItem("current-image-filename")) {
      // retriveLocalFile();
    }
  }, []);

  const processToCheckout = async () => {
    try {
      setIsProcessing(true);
      const postCardResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/post-cards/`,
        {
          message: message,
          address: JSON.stringify(address),
        }
      );

      const createdPostCard = postCardResponse.data;

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/post-cards/${createdPostCard.id}/upload-images?previewPath=${previewFrontUrl}`,
        { image: "" }
      );

      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/post-cards/${createdPostCard.id}`,
        {
          filePath: `${process.env.NEXT_PUBLIC_S3_ENDPOINT}/postCards/${createdPostCard.id}/front.${previewFrontUrl?.split('.').pop()}`,
        }
      );

      localStorage.removeItem("current-image-filename");
      localStorage.setItem("postCardId", createdPostCard.id);
      router.push("/checkout");
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const submitUpdate = async () => {
    if (isUpdatingFromUrl && updateOrderRequest) {
      try {
        setIsSavingChanges(true);
        const postCard = updateOrderRequest.order.postCard;
        console.log('Starting submission process for postCard:', postCard.id);

        await axios.patch(
          `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/post-cards/${postCard.id}`,
          {
            message: message,
            address: JSON.stringify(address),
          }
        );
        console.log('Updated message and address successfully');

        if (selectedImageFile) {
          console.log('Processing new image file');
          const fileExt = selectedImageFile!.name.split(".").pop();
          const frontSignedUrlRes = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/post-cards/${postCard.id}/get-signed-url?ext=${fileExt}`
          );
          const { uploadUrl, fileUrl } = frontSignedUrlRes.data;

          const options = {
            headers: {
              "Content-Type": "application/octet-stream",
            },
          };

          await axios.put<{ url: string }>(uploadUrl, selectedImageFile, options);
          console.log('Uploaded image to S3 successfully');

          await axios.patch(
            `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/post-cards/${postCard.id}?isUpdatingFromUrl=true`,
            {
              filePath: fileUrl,
            }
          );
          console.log('Updated image file path successfully');
        }

        if (postCard.message !== message) {
          console.log('Message changed, regenerating back image');
          // Only regenerate back image if we have a preview URL
          if (previewFrontUrl) {
            await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/post-cards/${postCard.id}/upload-images?previewPath=${previewFrontUrl}&isUpdatingFromUrl=true`,
              { image: "" }
            );
            console.log('Regenerated back image successfully');
          } else {
            console.log('No preview URL available, skipping back image regeneration');
          }
        }

        console.log('All updates completed, now marking token as used');
      } catch (error) {
        console.error('Error during submission process:', error);
        alert('There was an error updating your post card. Please try again.');
        return; // Exit early if there's an error
      } finally {
        setIsSavingChanges(false);
      }

      // Mark the update request as used - This should always run if we get here
      console.log('Current token value:', token, 'Type:', typeof token);
      if (token && token !== 'null') {
        try {
          console.log('Marking token as used:', token);
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/orders/mark-update-request-used?token=${token}`
          );
          console.log('Token marked as used successfully:', response.data);
        } catch (error) {
          console.error('Error marking token as used:', error);
          // Don't prevent navigation even if this fails
        }
      } else {
        console.error('Token is invalid for marking as used:', token);
      }

      // Only navigate with token if we have a valid token
      if (token && token !== 'null') {
        router.push(`/updated-changes?token=${token}`);
      } else {
        console.error('No valid token available for navigation, token is:', token);
        router.push('/'); // Redirect to home if no valid token
      }
    }
  };

  const handleStepperClick = (stepIndex: number) => {
    if (!allowStepperNavigation || isAndroid) {
      return;
    }

    setSearchParams(prev => ({ ...Object.fromEntries(prev), step: stepIndex.toString() }))
  };

  return (
    <>
      <MobileView>
        <Stack gap={1}>
          {isProcessing && (
            <Box sx={{ paddingX: 3, paddingY: "200px" }}>
              <UITypography
                sx={{ marginBottom: 3 }}
                fontSize={18}
                fontFamily={"Quicksand"}
              >
                Preparing your postcard for checkout.
              </UITypography>
              <BorderLinearProgress />
            </Box>
          )}

          <Box
            sx={{
              visibility: isProcessing
                ? "collapse"
                : activeStep !== -1
                  ? "initial"
                  : "collapse",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: 44,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 0,
              }}
            >
              <Box
                sx={{
                  width: "90%",
                  height: "100%",
                  marginTop: "-9px",
                  backgroundColor: "#EEF1E7",
                  borderRadius: "20px",
                  opacity: 0.5,
                }}
              ></Box>
            </Box>
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              connector={<ColorlibConnector />}
            >
              {steps.map((label, index) => (
                <Step
                  onClick={() => handleStepperClick(index)}
                  key={label}
                  sx={{
                    cursor: (allowStepperNavigation && !isAndroid) ? 'pointer' : 'default',
                    opacity: (allowStepperNavigation && !isAndroid) ? 1 : 0.7
                  }}
                >
                  <StepLabel
                    classes={{ label: classes.step_label_root }}
                    slots={{
                      stepIcon: (props) => {
                        if (props.icon === 4) {
                          return <ColorlibStepIcon {...props} disabled={!allowStepperNavigation || isAndroid} />;
                        }
                        return isCompleted
                          ? <CompletedColorlibStepIcon {...props} />
                          : <ColorlibStepIcon {...props} disabled={!allowStepperNavigation || isAndroid} />;
                      }
                    }}
                  >
                    <UITypography
                      sx={{
                        fontFamily: "Quicksand",
                        color:
                          parseInt(activeStep.toString()) === index
                            ? "#648A65"
                            : "#000000",
                        fontSize: "0.75rem",
                        fontWeight:
                          parseInt(activeStep.toString()) === index ? 700 : 500,
                        textDecoration:
                          parseInt(activeStep.toString()) === index
                            ? "underline"
                            : "",
                        textUnderlineOffset: "8px",
                      }}
                    >
                      {label}
                    </UITypography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            <Container sx={{ marginTop: 3 }}>
              {previewProcessing && (
                <Box sx={{ paddingX: 3, paddingY: "200px" }}>
                  <UITypography
                    sx={{ marginBottom: 3 }}
                    fontSize={18}
                    fontFamily={"Quicksand"}
                  >
                    Image Proccessing...
                  </UITypography>
                  <BorderLinearProgress />
                </Box>
              )}

              {!previewProcessing &&
                (activeStep === 0 || activeStep === 0.1) && (
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: 3,
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          borderStyle: "dashed",
                          borderWidth: "3px",
                          borderColor: "#648A65",
                          boxSizing: "content-box",
                          maxHeight: { xs: 218.18 },
                          maxWidth: { xs: 327.27 },
                        }}
                      >
                        <Box
                          component="img"
                          sx={{
                            aspectRatio: 1.5,
                            maxHeight: { xs: 218.18 },
                            maxWidth: { xs: 327.27 },
                            opacity: isValidImage ? 1 : 0.5,
                          }}
                          src={typeof previewImageSrc === "string" ? previewImageSrc: previewImageSrc.src}
                        />
                        {isAndroid && !previewFileObject && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: "rgba(0, 0, 0, 0.7)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              zIndex: 10,
                            }}
                          >
                            <Box
                              sx={{
                                backgroundColor: "#FFFCF2",
                                padding: 2,
                                borderRadius: 2,
                                textAlign: "center",
                                maxWidth: "280px",
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                              }}
                            >
                              <UITypography
                                fontSize={16}
                                fontWeight={600}
                                color="#FF4444"
                                sx={{ marginBottom: 1 }}
                              >
                                Oh no! Your text messages are green!
                              </UITypography>
                              <UITypography
                                fontSize={14}
                                color="#666666"
                                lineHeight={1.4}
                              >
                                Our platform does not support Android devices and is only compatible with Apple/iOS.
                              </UITypography>
                            </Box>
                          </Box>
                        )}
                        <Box
                          sx={{
                            position: "absolute",
                            top: "6.09px",
                            left: "10.63px",
                            borderStyle: "dashed",
                            borderWidth: "3px",
                            borderColor: "#FFFFFF",
                            boxSizing: "inherit",
                            height: { xs: 200 },
                            width: { xs: 300 },
                            maxHeight: { xs: 200 },
                            maxWidth: { xs: 300 },
                          }}
                        >
                          {!isValidImage && (
                            <Box sx={{ paddingY: 7, paddingX: 3 }}>
                              <Box
                                sx={{
                                  backgroundColor: "#FFFCF2",
                                  textAlign: "center",
                                  padding: 1,
                                  borderRadius: 1,
                                  boxShadow:
                                    "1.98px 1.98px 1.98px 0px #00000024;",
                                }}
                              >
                                <UITypography fontSize={14} variant="body1">
                                  {imageError}
                                </UITypography>
                              </Box>
                            </Box>
                          )}

                          <Box
                            sx={{
                              height: "19px",
                              width: "82px",
                              position: "absolute",
                              right: "-3px",
                              top: "-3px",
                              background: "#FFFCF2",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                              }}
                            >
                              <UITypography
                                sx={{
                                  marginTop: "3px",
                                }}
                                fontSize={12}
                                color="#ACA6A6"
                                fontWeight="bold"
                              >
                                Safe Area
                              </UITypography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {activeStep === 0 ? (
                      <Box>
                        <UIButton
                          component="label"
                          role={undefined}
                          variant="contained"
                          tabIndex={-1}
                          disabled={isAndroid}
                          sx={{
                            width: 232,
                            marginY: 2,
                          }}
                        >
                          <UITypography
                            sx={{
                              fontSize: 22,
                              fontWeight: 500,
                              lineHeight: "100%",
                              height: 20,
                              letterSpacing: 0,
                              textTransform: "none",
                            }}
                          >
                            Upload Your Photo
                          </UITypography>
                          <VisuallyHiddenInput
                            type="file"
                            accept="image/*"
                            multiple={false}
                            onChange={(event) =>
                              onFilesSelected(event.target.files)
                            }
                          />
                        </UIButton>
                        <UITypography
                          variant="subtitle2"
                          fontFamily={"Quicksand"}
                          sx={{ fontSize: 14, paddingX: 7, fontWeight: 400 }}
                        >
                          Upload any landscape photo taken from your iPhone.
                        </UITypography>
                      </Box>
                    ) : (
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Stack spacing={2} justifyContent={"center"}>
                          <UIButton
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            sx={{
                              width: 210,
                            }}
                            disabled={!isValidImage || isAndroid}
                            onClick={onSaveImage}
                          >
                            <UITypography
                              sx={{
                                fontSize: 22,
                                fontWeight: 500,
                                textTransform: "none",
                              }}
                            >
                              Save Photo
                            </UITypography>
                          </UIButton>

                          <UIButton
                            component="label"
                            role={undefined}
                            variant="outlined"
                            tabIndex={-1}
                            sx={{
                              width: 210,
                              height: 54,
                            }}
                            disabled={isAndroid}
                          >
                            <UITypography
                              sx={{
                                fontSize: 22,
                                fontWeight: 500,
                                textTransform: "none",
                                lineHeight: 1,
                              }}
                            >
                              Change Photo
                            </UITypography>
                            <VisuallyHiddenInput
                              type="file"
                              accept="image/*"
                              multiple={false}
                              onChange={(event) =>
                                onFilesSelected(event.target.files)
                              }
                            />
                          </UIButton>
                        </Stack>
                      </Box>
                    )}
                  </Box>
                )}

              {activeStep === 1 && (
                <Box>
                  <Box
                    sx={{
                      backgroundColor: "#F6F2E7",
                      paddingY: 3,
                      paddingX: 3,
                      borderRadius: "4px",
                    }}
                  >
                    <UITypography
                      fontSize={14}
                      fontWeight={600}
                      marginBottom={3}
                      fontFamily={"Quicksand"}
                    >
                      Customize Your Message
                    </UITypography>
                    <Textarea
                      placeholder="Hey John,&#10;Japan has been amazing! Tokyo’s energy is unreal, Kyoto’s temples are peaceful, and the sushi—next level.&#10;Tried a tiny izakaya with incredible yakitori and sake.&#10;<3&#10;Wish you were here!&#10;Sarah"
                      minRows={9}
                      maxRows={9}
                      value={message}
                      onChange={handleChange}
                      sx={{
                        paddingLeft: 3,
                        paddingTop: 2,
                        paddingBottom: 2,
                        "--Textarea-focused": 1,
                        "--Textarea-focusedHighlight": "#648A65 !important",
                      }}
                    />
                    <Box sx={{ marginTop: 3 }}>
                      <UIButton
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        disabled={isAndroid}
                        sx={{
                          height: 38,
                          width: 184,
                        }}
                        onClick={onSaveMessage}
                      >
                        <UITypography
                          sx={{
                            fontSize: 22,
                            fontWeight: 500,
                            textTransform: "none",
                          }}
                        >
                          Save Message
                        </UITypography>
                      </UIButton>
                    </Box>
                  </Box>
                </Box>
              )}

              {activeStep === 2 && (
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
                          error={validatingAddress && !address.name}
                          fullWidth
                          sx={{
                            background: "white",
                          }}
                          id="name-field"
                          label="Name"
                          variant="outlined"
                          size="small"
                          value={address.name}
                          onChange={(event) => {
                            setAddress({
                              ...address,
                              name: event.target.value,
                            });
                          }}
                        />
                      </Grid>
                      <Grid size={12}>
                        <TextField
                          fullWidth
                          sx={{
                            background: "white",
                          }}
                          id="company-field"
                          label="Company (optional)"
                          variant="outlined"
                          size="small"
                          value={address.company}
                          onChange={(event) => {
                            setAddress({
                              ...address,
                              company: event.target.value,
                            });
                          }}
                        />
                      </Grid>
                      <Grid size={12}>
                        <Autocomplete
                          freeSolo
                          options={addressSuggestions}
                          getOptionLabel={(option) => {
                            if (typeof option === 'string') return option;
                            return option.display_name || '';
                          }}
                          loading={isLoadingSuggestions}
                          onInputChange={(event, newInputValue) => {
                            setAddress({
                              ...address,
                              street: newInputValue,
                            });
                            debouncedSearch(newInputValue);
                          }}
                          onChange={(event, newValue) => {
                            if (newValue && typeof newValue !== 'string') {
                              fillAddressFromSuggestion(newValue);
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={validatingAddress && !address.street}
                              fullWidth
                              sx={{
                                background: "white",
                              }}
                              label="Street Address"
                              variant="outlined"
                              size="small"
                              value={address.street}
                            />
                          )}
                          renderOption={(props, option) => (
                            <ListItem {...props}>
                              <ListItemText
                                primary={option.display_name}
                                primaryTypographyProps={{
                                  fontSize: 14,
                                  fontFamily: "Quicksand",
                                }}
                              />
                            </ListItem>
                          )}
                          PaperComponent={({ children }) => (
                            <Paper
                              sx={{
                                backgroundColor: "white",
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                maxHeight: 200,
                                overflow: "auto",
                              }}
                            >
                              {children}
                            </Paper>
                          )}
                        />
                      </Grid>
                      <Grid size={12}>
                        <TextField
                          fullWidth
                          sx={{
                            background: "white",
                          }}
                          id="suite-apartment-field"
                          label="Suite/Apartment (optional)"
                          variant="outlined"
                          size="small"
                          value={address.suite}
                          onChange={(event) => {
                            setAddress({
                              ...address,
                              suite: event.target.value,
                            });
                          }}
                        />
                      </Grid>

                      <Grid size={5}>
                        <TextField
                          error={validatingAddress && !address.city}
                          fullWidth
                          sx={{
                            background: "white",
                          }}
                          id="city-field"
                          label="City"
                          variant="outlined"
                          size="small"
                          value={address.city}
                          onChange={(event) => {
                            setAddress({
                              ...address,
                              city: event.target.value,
                            });
                          }}
                        />
                      </Grid>
                      <Grid size={4}>
                        <TextField
                          error={validatingAddress && !address.state}
                          fullWidth
                          sx={{
                            background: "white",
                          }}
                          id="state-field"
                          label="State"
                          variant="outlined"
                          size="small"
                          value={address.state}
                          onChange={(event) => {
                            setAddress({
                              ...address,
                              state: event.target.value,
                            });
                          }}
                        />
                      </Grid>
                      <Grid size={3}>
                        <TextField
                          error={validatingAddress && !address.zip}
                          fullWidth
                          sx={{
                            background: "white",
                          }}
                          id="zip-field"
                          label="Zip"
                          variant="outlined"
                          size="small"
                          value={address.zip}
                          onChange={(event) => {
                            setAddress({
                              ...address,
                              zip: event.target.value,
                            });
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
                        disabled={isAndroid}
                        sx={{
                          height: 38,
                          width: 184,
                        }}
                        onClick={onSaveAddress}
                      >
                        <UITypography
                          sx={{
                            fontSize: 22,
                            fontWeight: 500,
                            textTransform: "none",
                          }}
                        >
                          Save Address
                        </UITypography>
                      </UIButton>
                    </Box>
                  </Box>
                </Box>
              )}

              {activeStep === 3 && (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: 3,
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        borderStyle: "dashed",
                        borderWidth: "3px",
                        borderColor: "#648A65",
                        boxSizing: "content-box",
                        maxHeight: { xs: 218.18 },
                        maxWidth: { xs: 327.27 },
                      }}
                    >
                      <Box
                        component="img"
                        sx={{
                          aspectRatio: 1.5,
                          maxHeight: { xs: 218.18 },
                          maxWidth: { xs: 327.27 },
                        }}
                        src={typeof previewImageSrc === "string" ? previewImageSrc : previewImageSrc.src}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: "6.09px",
                          left: "10.63px",

                          height: { xs: 200 },
                          width: { xs: 300 },
                          maxHeight: { xs: 200 },
                          maxWidth: { xs: 300 },
                        }}
                      >
                        <></>
                      </Box>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: 3,
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        borderStyle: "dashed",
                        borderColor: "#648A65",
                        borderWidth: "3px",
                        boxSizing: "content-box",
                        maxHeight: { xs: 218.18 },
                        maxWidth: { xs: 327.27 },
                      }}
                    >
                      <Box
                        component="img"
                        sx={{
                          aspectRatio: 1.5,
                          maxHeight: { xs: 218.18 },
                          maxWidth: { xs: 327.27 },
                          backgroundColor: "#FFFFFF",
                        }}
                        src={BackDecalsPng?.src ?? BackDecalsPng}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: "6.09px",
                          left: "10.63px",
                          height: { xs: 200 },
                          width: { xs: 300 },
                          maxHeight: { xs: 200 },
                          maxWidth: { xs: 300 },
                        }}
                      >
                        <Grid container>
                          <Grid size={6}>
                            <Box
                              sx={{
                                textAlign: "left",
                                paddingX: 1,
                                paddingTop: 5,
                              }}
                            >
                              <UIPostCardMessage
                                sx={{
                                  whiteSpace: "pre-wrap",
                                  wordWrap: "break-word",
                                  overflowWrap: "break-word",
                                  maxWidth: "100%",
                                  maxHeight: "180px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 8,
                                  WebkitBoxOrient: "vertical"
                                }}
                                fontSize={11}
                              >
                                {message || "Your message will appear here..."}
                              </UIPostCardMessage>
                            </Box>
                          </Grid>
                          <Grid size={6}>
                            <Box
                              sx={{
                                textAlign: "left",
                                paddingX: 3,
                                paddingTop: "85px",
                              }}
                            >
                              <UIPostCardMessage
                                sx={{
                                  wordWrap: "break-word",
                                  overflowWrap: "break-word",
                                  maxWidth: "100%",
                                  maxHeight: "20px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: "vertical"
                                }}
                                fontSize={10}
                                lineHeight={1}
                              >
                                {address.name}
                              </UIPostCardMessage>
                              <UIPostCardMessage
                                sx={{
                                  wordWrap: "break-word",
                                  overflowWrap: "break-word",
                                  maxWidth: "100%",
                                  maxHeight: "20px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: "vertical"
                                }}
                                fontSize={10}
                                lineHeight={1}
                              >
                                {address.street}
                              </UIPostCardMessage>
                              {(address.company || address.suite) && (
                                <UIPostCardMessage
                                  sx={{
                                    wordWrap: "break-word",
                                    overflowWrap: "break-word",
                                    maxWidth: "100%",
                                    maxHeight: "20px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: "vertical"
                                  }}
                                  fontSize={10}
                                  lineHeight={1}
                                >
                                  {address.company} {address.suite}
                                </UIPostCardMessage>
                              )}
                              <UIPostCardMessage
                                sx={{
                                  wordWrap: "break-word",
                                  overflowWrap: "break-word",
                                  maxWidth: "100%",
                                  maxHeight: "20px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: "vertical"
                                }}
                                fontSize={10}
                                lineHeight={1}
                              >
                                {address.city}, {address.state} {address.zip}
                              </UIPostCardMessage>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </Box>

                  <Box>
                    {isUpdatingFromUrl ? (
                      <UIButton
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        disabled={isAndroid || isSavingChanges}
                        sx={{
                          marginBottom: 2,
                          width: 241,
                        }}
                        onClick={submitUpdate}
                      >
                        <UITypography fontSize={22}>
                          {isSavingChanges ? "Submitting Changes" : "Submit Changes"}
                        </UITypography>
                      </UIButton>
                    ) : (
                      <UIButton
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        disabled={isAndroid}
                        sx={{
                          marginBottom: 2,
                          width: 241,
                        }}
                        onClick={processToCheckout}
                      >
                        <UITypography fontSize={22}>
                          Proceed to Checkout
                        </UITypography>
                      </UIButton>
                    )}
                    <UIButton
                      component="label"
                      role={undefined}
                      variant="outlined"
                      tabIndex={-1}
                      disabled={isAndroid}
                      sx={{
                        width: 241,
                        height: 54,
                      }}
                      onClick={goToStepNavigation}
                    >
                      <UITypography fontSize={22}>Edit Card</UITypography>
                    </UIButton>
                  </Box>
                </Box>
              )}
            </Container>
          </Box>

          <Box
            sx={{
              visibility: isProcessing
                ? "collapse"
                : activeStep !== -1
                  ? "collapse"
                  : "initial",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Stack spacing={2} justifyContent={"center"}>
                <UIButton
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  disabled={isAndroid}
                  sx={{
                    width: 241,
                  }}
                  onClick={() => setSearchParams(prev => ({ ...Object.fromEntries(prev), step: "0.1" }))}
                >
                  <UITypography fontSize={22} fontWeight={500}>
                    Edit Photo
                  </UITypography>
                </UIButton>

                <UIButton
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  disabled={isAndroid}
                  sx={{
                    width: 241,
                  }}
                  onClick={() => setSearchParams(prev => ({ ...Object.fromEntries(prev), step: "1" }))}
                >
                  <UITypography fontSize={22} fontWeight={500}>
                    Edit Message
                  </UITypography>
                </UIButton>

                <UIButton
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  disabled={isAndroid}
                  sx={{
                    width: 241,
                  }}
                  onClick={() => setSearchParams(prev => ({ ...Object.fromEntries(prev), step: "2" }))}
                >
                  <UITypography fontSize={22} fontWeight={500}>
                    Edit Address
                  </UITypography>
                </UIButton>

                <UIButton
                  component="label"
                  role={undefined}
                  variant="outlined"
                  tabIndex={-1}
                  disabled={isAndroid}
                  sx={{
                    height: 54,
                    width: 241,
                  }}
                  onClick={() => setSearchParams({ step: "3" })}
                >
                  <UITypography fontSize={22} fontWeight={500}>
                    Cancel
                  </UITypography>
                </UIButton>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </MobileView>

      <BrowserView>
        <Container maxWidth={false}>
          {isProcessing && (
            <Box sx={{ paddingX: 3, paddingY: "200px" }}>
              <UITypography
                sx={{ marginBottom: 3 }}
                fontSize={18}
                fontFamily={"Quicksand"}
              >
                Preparing your postcard for checkout.
              </UITypography>
              <BorderLinearProgress />
            </Box>
          )}

          <Stack
            gap={1}
            sx={{
              visibility: isProcessing
                ? "collapse"
                : activeStep !== -1
                  ? "initial"
                  : "collapse",
            }}
          >
            <Container maxWidth="sm">
              <Box
                sx={{
                  visibility: isProcessing
                    ? "hidden"
                    : activeStep !== -1
                      ? "initial"
                      : "hidden",
                }}
              >
                <Box
                  sx={{
                    height: 44,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 0,
                    top: 42,
                    marginTop: "-40px",
                  }}
                >
                  <Box
                    sx={{
                      width: "86%",
                      height: "100%",
                      marginTop: "-6px",
                      backgroundColor: "#EEF1E7",
                      borderRadius: "20px",
                      opacity: 0.5,
                    }}
                  ></Box>
                </Box>

                <Stepper
                  activeStep={activeStep}
                  alternativeLabel
                  connector={<ColorlibConnector />}
                >
                  {steps.map((label, index) => (
                    <Step
                      onClick={() => handleStepperClick(index)}
                      key={label}
                      sx={{
                        cursor: (allowStepperNavigation && !isAndroid) ? 'pointer' : 'default',
                        opacity: (allowStepperNavigation && !isAndroid) ? 1 : 0.7
                      }}
                    >
                      <StepLabel
                        classes={{ label: classes.step_label_root_browser }}
                        slots={{
                          stepIcon: (props) => {
                            if (props.icon === 4) {
                              return <ColorlibStepIcon {...props} disabled={!allowStepperNavigation || isAndroid} />;
                            }
                            return isCompleted
                              ? <CompletedColorlibStepIcon {...props} />
                              : <ColorlibStepIcon {...props} disabled={!allowStepperNavigation || isAndroid} />;
                          }
                        }}
                      >
                        <UITypography
                          sx={{
                            fontFamily: "Quicksand",
                            color:
                              parseInt(activeStep.toString()) === index
                                ? "#648A65"
                                : "#000000",
                            fontSize: "0.75rem",
                            fontWeight:
                              parseInt(activeStep.toString()) === index
                                ? 700
                                : 500,
                            textDecoration:
                              parseInt(activeStep.toString()) === index
                                ? "underline"
                                : "",
                            textUnderlineOffset: "8px",
                          }}
                        >
                          {label}
                        </UITypography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </Container>

            <Container maxWidth={false} sx={{ marginTop: 3 }}>
              {previewProcessing && (
                <Box sx={{ paddingX: 3, paddingY: "200px" }}>
                  <UITypography
                    sx={{ marginBottom: 3 }}
                    fontSize={18}
                    fontFamily={"Quicksand"}
                  >
                    Image Proccessing...
                  </UITypography>
                  <BorderLinearProgress />
                </Box>
              )}

              {!previewProcessing &&
                (activeStep === 0 || activeStep === 0.1) && (
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: 3,
                      }}
                    >
                      <Box
                        sx={{
                          padding: 3,
                          backgroundColor: "white",
                        }}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            borderStyle: "dashed",
                            borderWidth: "3px",
                            borderColor: "#648A65",
                            boxSizing: "content-box",
                            height: { xs: 480 },
                            width: { xs: 720 },
                            boxShadow: "4px 5px 7px 0px #00000026",
                          }}
                        >
                          <Box
                            component="img"
                            sx={{
                              aspectRatio: 1.5,
                              height: { xs: 480 },
                              width: { xs: 720 },
                              opacity: isValidImage ? 1 : 0.5,
                            }}
                            src={typeof previewImageSrc === "string" ? previewImageSrc: previewImageSrc.src}
                          />
                          {isAndroid && !previewFileObject && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: "rgba(0, 0, 0, 0.7)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 10,
                              }}
                            >
                              <Box
                                sx={{
                                  backgroundColor: "#FFFCF2",
                                  padding: 3,
                                  borderRadius: 2,
                                  textAlign: "center",
                                  maxWidth: "400px",
                                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                                }}
                              >
                                <UITypography
                                  fontSize={20}
                                  fontWeight={600}
                                  color="#FF4444"
                                  sx={{ marginBottom: 2 }}
                                >
                                  Oh no! Your text messages are green!
                                </UITypography>
                                <UITypography
                                  fontSize={16}
                                  color="#666666"
                                  lineHeight={1.4}
                                >
                                  Our platform does not support Android devices and is only compatible with Apple/iOS.
                                </UITypography>
                              </Box>
                            </Box>
                          )}
                          <Box
                            sx={{
                              position: "absolute",
                              top: "6.09px",
                              left: "10.63px",
                              borderStyle: "dashed",
                              borderWidth: "3px",
                              borderColor: "#FFFFFF",
                              boxSizing: "inherit",
                              height: { xs: 460 },
                              width: { xs: 694 },
                            }}
                          >
                            {!isValidImage && (
                              <Box
                                sx={{
                                  display: "flex",
                                  height: "100%",
                                  width: "100%",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Box
                                  sx={{
                                    width: "50%",
                                    backgroundColor: "#FFFCF2",
                                    textAlign: "center",
                                    padding: 1,
                                    borderRadius: 1,
                                    boxShadow:
                                      "1.98px 1.98px 1.98px 0px #00000024;",
                                  }}
                                >
                                  <UITypography fontSize={14} variant="body1">
                                    {imageError}
                                  </UITypography>
                                </Box>
                              </Box>
                            )}

                            <Box
                              sx={{
                                height: 30,
                                width: 128,
                                position: "absolute",
                                right: "-3px",
                                top: "-3px",
                                background: "#FFFCF2",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <UITypography
                                fontSize={18}
                                color="#ACA6A6"
                                fontWeight={700}
                              >
                                Safe Area
                              </UITypography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {activeStep === 0 ? (
                      <Box>
                        <UIButton
                          component="label"
                          role={undefined}
                          variant="contained"
                          tabIndex={-1}
                          disabled={isAndroid}
                          sx={{
                            width: 224,
                            height: 50,
                            marginTop: 2,
                            marginBottom: 2,
                          }}
                        >
                          <UITypography
                            sx={{
                              fontSize: 22,
                              textTransform: "none",
                            }}
                          >
                            Upload Your Photo
                          </UITypography>
                          <VisuallyHiddenInput
                            type="file"
                            accept="image/*"
                            multiple={false}
                            onChange={(event) =>
                              onFilesSelected(event.target.files)
                            }
                          />
                        </UIButton>
                        <UITypography
                          sx={{
                            fontSize: 16,
                            paddingX: 7,
                            fontFamily: "Quicksand",
                          }}
                        >
                          Upload any landscape photo.
                        </UITypography>
                      </Box>
                    ) : (
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Stack spacing={2} justifyContent={"center"}>
                          <UIButton
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            sx={{
                              marginBottom: 2,
                            }}
                            disabled={!isValidImage || isAndroid}
                            onClick={onSaveImage}
                          >
                            <UITypography
                              sx={{
                                fontSize: 22,
                                width: 242,
                              }}
                            >
                              Save Photo
                            </UITypography>
                          </UIButton>

                          <UIButton
                            component="label"
                            role={undefined}
                            variant="outlined"
                            tabIndex={-1}
                            disabled={isAndroid}
                            sx={{
                              marginBottom: 2,
                              height: 54,
                            }}
                          >
                            <UITypography
                              sx={{
                                fontSize: 22,
                                width: 242,
                              }}
                            >
                              Change Photo
                            </UITypography>
                            <VisuallyHiddenInput
                              type="file"
                              accept="image/*"
                              multiple={false}
                              onChange={(event) =>
                                onFilesSelected(event.target.files)
                              }
                            />
                          </UIButton>
                        </Stack>
                      </Box>
                    )}
                  </Box>
                )}

              {activeStep === 1 && (
                <Box>
                  <Grid container sx={{ paddingX: "80px" }}>
                    <Grid size={7}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          marginBottom: 3,
                        }}
                      >
                        <Box
                          sx={{
                            padding: 3,
                            backgroundColor: "white",
                          }}
                        >
                          <Box
                            sx={{
                              position: "relative",
                              borderStyle: "dashed",
                              borderWidth: "3px",
                              borderColor: "#648A65",
                              boxSizing: "content-box",
                              maxHeight: { xs: 480 },
                              maxWidth: { xs: 720 },
                              boxShadow: "4px 5px 7px 0px #00000026",
                            }}
                          >
                            <Box
                              component="img"
                              sx={{
                                aspectRatio: 1.5,
                                maxHeight: { xs: 480 },
                                maxWidth: { xs: 720 },
                                backgroundColor: "#FFFFFF",
                              }}
                              src={BackDecalsPng?.src ?? BackDecalsPng}
                            />
                            <Box
                              sx={{
                                position: "absolute",
                                top: "6.09px",
                                left: "10.63px",
                                height: { xs: 480 },
                                width: { xs: 720 },
                                maxHeight: { xs: 480 },
                                maxWidth: { xs: 720 },
                              }}
                            >
                              <Grid container>
                                <Grid size={6}>
                                  <Box
                                    sx={{
                                      textAlign: "left",
                                      paddingX: 3,
                                      paddingTop: 5,
                                    }}
                                  >
                                    <UIPostCardMessage
                                      sx={{
                                        whiteSpace: "pre-wrap",
                                        wordWrap: "break-word",
                                        overflowWrap: "break-word",
                                        maxWidth: "100%",
                                        maxHeight: "400px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 12,
                                        WebkitBoxOrient: "vertical"
                                      }}
                                      fontSize={24}
                                      lineHeight={1.5}
                                    >
                                      {message}
                                    </UIPostCardMessage>
                                  </Box>
                                </Grid>
                                <Grid size={6}>
                                  <Box
                                    sx={{
                                      textAlign: "left",
                                      paddingX: 3,
                                      paddingTop: "85px",
                                    }}
                                  >
                                    <UIPostCardMessage
                                      sx={{
                                        wordWrap: "break-word",
                                        overflowWrap: "break-word",
                                        maxWidth: "100%",
                                        maxHeight: "20px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: "vertical"
                                      }}
                                      fontSize={10}
                                      lineHeight={1}
                                    >
                                      {address.name}
                                    </UIPostCardMessage>
                                    <UIPostCardMessage
                                      sx={{
                                        wordWrap: "break-word",
                                        overflowWrap: "break-word",
                                        maxWidth: "100%",
                                        maxHeight: "20px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: "vertical"
                                      }}
                                      fontSize={10}
                                      lineHeight={1}
                                    >
                                      {address.street}
                                    </UIPostCardMessage>
                                    {(address.company || address.suite) && (
                                      <UIPostCardMessage
                                        sx={{
                                          wordWrap: "break-word",
                                          overflowWrap: "break-word",
                                          maxWidth: "100%",
                                          maxHeight: "20px",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          display: "-webkit-box",
                                          WebkitLineClamp: 1,
                                          WebkitBoxOrient: "vertical"
                                        }}
                                        fontSize={10}
                                        lineHeight={1}
                                      >
                                        {address.company} {address.suite}
                                      </UIPostCardMessage>
                                    )}
                                    <UIPostCardMessage
                                      sx={{
                                        wordWrap: "break-word",
                                        overflowWrap: "break-word",
                                        maxWidth: "100%",
                                        maxHeight: "20px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: "vertical"
                                      }}
                                      fontSize={10}
                                      lineHeight={1}
                                    >
                                      {address.city}, {address.state}{" "}
                                      {address.zip}
                                    </UIPostCardMessage>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid size={4}>
                      <Box>
                        <Box
                          sx={{
                            backgroundColor: "#F6F2E7",
                            marginTop: 5,
                            paddingY: 3,
                            paddingX: 5,
                            borderRadius: "4px",
                          }}
                        >
                          <UITypography
                            fontSize={14}
                            fontWeight={400}
                            marginBottom={3}
                            fontFamily={"Quicksand"}
                          >
                            What message should we print on your postcard?
                          </UITypography>
                          <Textarea
                            placeholder="Hey John,&#10;Japan has been amazing! Tokyo’s energy is unreal, Kyoto’s temples are peaceful, and the sushi—next level.&#10;Tried a tiny izakaya with incredible yakitori and sake.&#10;<3&#10;Wish you were here!&#10;Sarah"
                            minRows={9}
                            maxRows={9}
                            value={message}
                            onChange={handleChange}
                            sx={{
                              paddingLeft: 3,
                              paddingTop: 2,
                              paddingBottom: 2,
                              "--Textarea-focused": 1,
                              "--Textarea-focusedHighlight":
                                "#648A65 !important",
                            }}
                          />
                          <Box sx={{ marginTop: 3 }}>
                            <UIButton
                              component="label"
                              role={undefined}
                              variant="contained"
                              tabIndex={-1}
                              disabled={isAndroid}
                              sx={{
                                marginBottom: 0,
                                width: "100%",
                              }}
                              onClick={onSaveMessage}
                            >
                              <UITypography
                                sx={{
                                  fontSize: 22,
                                }}
                              >
                                Save Message
                              </UITypography>
                            </UIButton>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {activeStep === 2 && (
                <Box>
                  <Grid container sx={{ paddingX: "80px" }}>
                    <Grid size={7}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          marginBottom: 3,
                        }}
                      >
                        <Box
                          sx={{
                            padding: 3,
                            backgroundColor: "white",
                          }}
                        >
                          <Box
                            sx={{
                              position: "relative",
                              borderStyle: "dashed",
                              borderWidth: "3px",
                              borderColor: "#648A65",
                              boxSizing: "content-box",
                              maxHeight: { xs: 480 },
                              maxWidth: { xs: 720 },
                              boxShadow: "4px 5px 7px 0px #00000026",
                            }}
                          >
                            <Box
                              component="img"
                              sx={{
                                aspectRatio: 1.5,
                                maxHeight: { xs: 480 },
                                maxWidth: { xs: 720 },
                                backgroundColor: "#FFFFFF",
                              }}
                              src={BackDecalsPng?.src ?? BackDecalsPng}
                            />
                            <Box
                              sx={{
                                position: "absolute",
                                top: "6.09px",
                                left: "10.63px",
                                height: { xs: 480 },
                                width: { xs: 720 },
                                maxHeight: { xs: 480 },
                                maxWidth: { xs: 720 },
                              }}
                            >
                              <Grid container>
                                <Grid size={6}>
                                  <Box
                                    sx={{
                                      textAlign: "left",
                                      paddingX: 3,
                                      paddingTop: 5,
                                    }}
                                  >
                                    <UIPostCardMessage
                                      sx={{
                                        whiteSpace: "pre-wrap",
                                        wordWrap: "break-word",
                                        overflowWrap: "break-word",
                                        maxWidth: "100%",
                                        maxHeight: "400px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 12,
                                        WebkitBoxOrient: "vertical"
                                      }}
                                      fontSize={24}
                                      lineHeight={1.5}
                                    >
                                      {message}
                                    </UIPostCardMessage>
                                  </Box>
                                </Grid>
                                <Grid size={6}>
                                  <Box
                                    sx={{
                                      textAlign: "left",
                                      paddingX: 5,
                                      paddingTop: "190px",
                                    }}
                                  >
                                       {(address.company || address.suite) && (
                                      <UIPostCardMessage
                                        sx={{
                                          wordWrap: "break-word",
                                          overflowWrap: "break-word",
                                          maxWidth: "100%",
                                          maxHeight: "30px",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          display: "-webkit-box",
                                          WebkitLineClamp: 1,
                                          WebkitBoxOrient: "vertical"
                                        }}
                                        fontSize={20}
                                        lineHeight={1.25}
                                      >
                                        {address.company} {address.suite}
                                      </UIPostCardMessage>
                                    )}
                                    <UIPostCardMessage
                                      sx={{
                                        wordWrap: "break-word",
                                        overflowWrap: "break-word",
                                        maxWidth: "100%",
                                        maxHeight: "30px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: "vertical"
                                      }}
                                      fontSize={20}
                                      lineHeight={1.25}
                                    >
                                      {address.name}
                                    </UIPostCardMessage>
                                    <UIPostCardMessage
                                      sx={{
                                        wordWrap: "break-word",
                                        overflowWrap: "break-word",
                                        maxWidth: "100%",
                                        maxHeight: "30px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: "vertical"
                                      }}
                                      fontSize={20}
                                      lineHeight={1.25}
                                    >
                                      {address.street}
                                    </UIPostCardMessage>
                                 
                                    <UIPostCardMessage
                                      sx={{
                                        wordWrap: "break-word",
                                        overflowWrap: "break-word",
                                        maxWidth: "100%",
                                        maxHeight: "30px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: "vertical"
                                      }}
                                      fontSize={20}
                                      lineHeight={1.25}
                                    >
                                      {address.city} {address.state}{" "}
                                      {address.zip}
                                    </UIPostCardMessage>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid size={4}>
                      <Box>
                        <Box
                          sx={{
                            backgroundColor: "#F6F2E7",
                            marginTop: 5,
                            paddingY: 3,
                            paddingX: 6,
                            borderRadius: "4px",
                          }}
                        >
                          <UITypography
                            fontSize={14}
                            fontWeight={400}
                            marginBottom={3}
                            fontFamily={"Quicksand"}
                          >
                            Who are you sending the postcard to?
                          </UITypography>
                          <Grid container spacing={3}>
                                <Grid size={12}>
                                  <TextField
                                    fullWidth
                                    sx={{
                                      backgroundColor: "white",
                                    }}
                                    id="company-field"
                                    label="Company (optional)"
                                    variant="outlined"
                                    size="small"
                                    value={address.company}
                                    onChange={(event) => {
                                      setAddress({
                                        ...address,
                                        company: event.target.value,
                                      });
                                    }}
                                  />
                                </Grid>
                            <Grid size={12}>
                              <TextField
                                error={validatingAddress && !address.name}
                                fullWidth
                                sx={{
                                  backgroundColor: "white",
                                }}
                                id="name-field"
                                label="Name"
                                variant="outlined"
                                size="small"
                                value={address.name}
                                onChange={(event) => {
                                  setAddress({
                                    ...address,
                                    name: event.target.value,
                                  });
                                }}
                              />
                            </Grid>
                            <Grid size={12}>
                              <Autocomplete
                                freeSolo
                                options={addressSuggestions}
                                getOptionLabel={(option) => {
                                  if (typeof option === 'string') return option;
                                  return option.display_name || '';
                                }}
                                loading={isLoadingSuggestions}
                                onInputChange={(event, newInputValue) => {
                                  setAddress({
                                    ...address,
                                    street: newInputValue,
                                  });
                                  debouncedSearch(newInputValue);
                                }}
                                onChange={(event, newValue) => {
                                  if (newValue && typeof newValue !== 'string') {
                                    fillAddressFromSuggestion(newValue);
                                  }
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    error={validatingAddress && !address.street}
                                    fullWidth
                                    sx={{
                                      backgroundColor: "white",
                                    }}
                                    label="Street Address"
                                    variant="outlined"
                                    size="small"
                                    value={address.street}
                                  />
                                )}
                                renderOption={(props, option) => (
                                  <ListItem {...props}>
                                    <ListItemText
                                      primary={option.display_name}
                                      primaryTypographyProps={{
                                        fontSize: 14,
                                        fontFamily: "Quicksand",
                                      }}
                                    />
                                  </ListItem>
                                )}
                                PaperComponent={({ children }) => (
                                  <Paper
                                    sx={{
                                      backgroundColor: "white",
                                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                      maxHeight: 200,
                                      overflow: "auto",
                                    }}
                                  >
                                    {children}
                                  </Paper>
                                )}
                              />
                            </Grid>
                            <Grid size={12}>
                              <TextField
                                fullWidth
                                sx={{
                                  backgroundColor: "white",
                                }}
                                id="suite-apartment-field"
                                label="Suite/Apartment (optional)"
                                variant="outlined"
                                size="small"
                                value={address.suite}
                                onChange={(event) => {
                                  setAddress({
                                    ...address,
                                    suite: event.target.value,
                                  });
                                }}
                              />
                            </Grid>

                            <Grid size={5}>
                              <TextField
                                error={validatingAddress && !address.city}
                                fullWidth
                                sx={{
                                  backgroundColor: "white",
                                }}
                                id="city-field"
                                label="City"
                                variant="outlined"
                                size="small"
                                value={address.city}
                                onChange={(event) => {
                                  setAddress({
                                    ...address,
                                    city: event.target.value,
                                  });
                                }}
                              />
                            </Grid>
                            <Grid size={4}>
                              <TextField
                                error={validatingAddress && !address.state}
                                fullWidth
                                sx={{
                                  backgroundColor: "white",
                                }}
                                id="state-field"
                                label="State"
                                variant="outlined"
                                size="small"
                                value={address.state}
                                onChange={(event) => {
                                  setAddress({
                                    ...address,
                                    state: event.target.value,
                                  });
                                }}
                              />
                            </Grid>
                            <Grid size={3}>
                              <TextField
                                error={validatingAddress && !address.zip}
                                fullWidth
                                sx={{
                                  backgroundColor: "white",
                                }}
                                id="zip-field"
                                label="Zip"
                                variant="outlined"
                                size="small"
                                value={address.zip}
                                onChange={(event) => {
                                  setAddress({
                                    ...address,
                                    zip: event.target.value,
                                  });
                                }}
                              />
                            </Grid>
                          </Grid>

                          <Box sx={{ marginTop: 4 }}>
                            <UIButton
                              component="label"
                              role={undefined}
                              variant="contained"
                              tabIndex={-1}
                              disabled={isAndroid}
                              sx={{
                                marginBottom: 0,
                                width: "100%",
                              }}
                              onClick={onSaveAddress}
                            >
                              <UITypography
                                sx={{
                                  fontSize: 22,
                                }}
                              >
                                Save Address
                              </UITypography>
                            </UIButton>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {activeStep === 3 && (
                <Container maxWidth={false} sx={{ padding: "0 !important" }}>
                  <Grid container>
                    <Grid size={6}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "right",
                          paddingRight: 2,
                          marginBottom: 3,
                        }}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            boxShadow: "3.19px 4.25px 5.63px 0px #00000026",
                            boxSizing: "content-box",
                            // borderStyle: "dashed",
                            // borderColor: "#648A65",
                            maxHeight: { xs: 480 },
                            maxWidth: { xs: 720 },
                          }}
                        >
                          <Box
                            component="img"
                            sx={{
                              aspectRatio: 1.5,
                              maxHeight: { xs: 480 },
                              maxWidth: { xs: 720 },
                              opacity: isValidImage ? 1 : 0.5,
                            }}
                            src={typeof previewImageSrc === "string" ? previewImageSrc: previewImageSrc.src}
                          />
                        </Box>
                      </Box>
                    </Grid>
                    <Grid size={6}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "left",
                          paddingLeft: 2,
                          marginBottom: 3,
                        }}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            boxShadow: "3.19px 4.25px 5.63px 0px #00000026",
                            boxSizing: "content-box",
                            // borderStyle: "dashed",
                            // borderColor: "#648A65",
                            maxHeight: { xs: 480 },
                            maxWidth: { xs: 720 },
                          }}
                        >
                          <Box
                            component="img"
                            sx={{
                              aspectRatio: 1.5,
                              maxHeight: { xs: 480 },
                              maxWidth: { xs: 720 },
                              backgroundColor: "#FFFFFF",
                            }}
                            src={BackDecalsPng?.src ?? BackDecalsPng}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              top: "6.09px",
                              left: "10.63px",
                              height: { xs: 600 },
                              width: { xs: 900 },
                              maxHeight: { xs: 600 },
                              maxWidth: { xs: 900 },
                            }}
                          >
                            <Grid container sx={{ width: "700px" }}>
                              <Grid size={6}>
                                <Box
                                  sx={{
                                    textAlign: "left",
                                    paddingLeft: 3,
                                    paddingTop: 5,
                                  }}
                                >
                                  <UIPostCardMessage
                                    sx={{
                                      whiteSpace: "pre-wrap",
                                      wordWrap: "break-word",
                                      overflowWrap: "break-word",
                                      maxWidth: "100%",
                                      maxHeight: "400px",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      display: "-webkit-box",
                                      WebkitLineClamp: 12,
                                      WebkitBoxOrient: "vertical"
                                    }}
                                    fontSize={24}
                                    lineHeight={1.5}
                                  >
                                    {message}
                                  </UIPostCardMessage>
                                </Box>
                              </Grid>
                              <Grid size={6}>
                                <Box
                                  sx={{
                                    textAlign: "left",
                                    paddingX: 5,
                                    paddingTop: "190px",
                                  }}
                                >
                                  <UIPostCardMessage
                                    sx={{
                                      wordWrap: "break-word",
                                      overflowWrap: "break-word",
                                      maxWidth: "100%",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis"
                                    }}
                                    fontSize={20}
                                    lineHeight={1.25}
                                  >
                                    {address.name}
                                  </UIPostCardMessage>
                                  <UIPostCardMessage
                                    sx={{
                                      wordWrap: "break-word",
                                      overflowWrap: "break-word",
                                      maxWidth: "100%",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis"
                                    }}
                                    fontSize={20}
                                    lineHeight={1.25}
                                  >
                                    {address.street}
                                  </UIPostCardMessage>
                                  {(address.company || address.suite) && (
                                    <UIPostCardMessage
                                      sx={{
                                        wordWrap: "break-word",
                                        overflowWrap: "break-word",
                                        maxWidth: "100%",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis"
                                      }}
                                      fontSize={20}
                                      lineHeight={1.25}
                                    >
                                      {address.company} {address.suite}
                                    </UIPostCardMessage>
                                  )}
                                  <UIPostCardMessage
                                    sx={{
                                      wordWrap: "break-word",
                                      overflowWrap: "break-word",
                                      maxWidth: "100%",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis"
                                    }}
                                    fontSize={20}
                                    lineHeight={1.25}
                                  >
                                    {address.city}, {address.state}{" "}
                                    {address.zip}
                                  </UIPostCardMessage>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box
                    sx={{
                      marginTop: 5,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Box sx={{ width: 520 }}>
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent={"center"}
                      >
                        <UIButton
                          component="label"
                          role={undefined}
                          variant="outlined"
                          tabIndex={-1}
                          disabled={isAndroid}
                          sx={{
                            marginBottom: 2,
                            width: "33%",
                            height: 54,
                          }}
                          onClick={() => setSearchParams(prev => ({ ...Object.fromEntries(prev), step: "0" }))}
                        >
                          <UITypography fontSize={22}>Edit Photo</UITypography>
                        </UIButton>

                        <UIButton
                          component="label"
                          role={undefined}
                          variant="outlined"
                          tabIndex={-1}
                          disabled={isAndroid}
                          sx={{
                            marginBottom: 2,
                            width: "33%",
                            height: 54,
                          }}
                          onClick={() => setSearchParams(prev => ({ ...Object.fromEntries(prev), step: "1" }))}
                        >
                          <UITypography fontSize={22}>
                            Edit Message
                          </UITypography>
                        </UIButton>

                        <UIButton
                          component="label"
                          role={undefined}
                          variant="outlined"
                          tabIndex={-1}
                          disabled={isAndroid}
                          sx={{
                            marginBottom: 2,
                            width: "33%",
                            height: 54,
                          }}
                          onClick={() => setSearchParams(prev => ({ ...Object.fromEntries(prev), step: "2" }))}
                        >
                          <UITypography fontSize={22}>
                            Edit Address
                          </UITypography>
                        </UIButton>
                      </Stack>

                      {isUpdatingFromUrl ? (
                        <Box sx={{ marginTop: 3 }}>
                          <UIButton
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            disabled={isAndroid || isSavingChanges}
                            sx={{
                              marginBottom: 2,
                              width: "100%",
                            }}
                            onClick={submitUpdate}
                          >
                            <UITypography fontSize={22}>
                              {isSavingChanges ? "Submitting Changes" : "Submit Changes"}
                            </UITypography>
                          </UIButton>
                        </Box>
                      ) : (
                        <Box sx={{ marginTop: 3 }}>
                          <UIButton
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            disabled={isAndroid}
                            sx={{
                              marginBottom: 2,
                              width: "100%",
                            }}
                            onClick={processToCheckout}
                          >
                            <UITypography fontSize={22}>
                              Proceed to Checkout
                            </UITypography>
                          </UIButton>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Container>
              )}
            </Container>
          </Stack>
        </Container>
      </BrowserView>
    </>
  );
};
