import { useState, useRef, useEffect } from "react";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { Stack, Grid, Container, Box, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import { FormProvider, RHFTextField } from "@components/hook-form";
//onChange={handleChange}
import { FormSchema, defaultValues } from "../form";
import { MuiOtpInput } from "mui-one-time-password-input";

import { OTPLENGTH } from "@config";
import { useAppContext } from "@contexts/AppContext";
import { isMatch } from "date-fns";
import { useRouter } from "next/router";
import { useAppAuthContext } from "@contexts/AuthContext";
import { encryptWallet, restoreFromEncryptedWallet } from "@utils/wallet";
import { usePasscodeContext } from "@contexts/PasscodeContext";
import { PATH_DASHBOARD } from "@routes/paths";

// ----------------------------------------------------------------------

export default function EnterPasscode() {
  const [passcode, setPasscode] = useState("");
  const { wallet } = useAppAuthContext();
  const { changeIsAppLocked } = usePasscodeContext();
  const { push } = useRouter();

  const verifyPasscode = async (passcode) => {
    try {
      const decryptedWallet = await restoreFromEncryptedWallet(
        wallet,
        passcode
      );
      if (decryptedWallet) {
        console.log("passcode verified");
        changeIsAppLocked();
        push(PATH_DASHBOARD.root);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleInput = (newValue) => {
    setPasscode(newValue);
    console.log(newValue.length, OTPLENGTH);
    if (newValue.length === OTPLENGTH) {
      verifyPasscode(newValue);
    }
  };

  return (
    <Container>
      <Stack gap={2}>
        <Box display="flex" justifyContent="space-between"></Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Box display="flex" justifyContent="center" mb={2}>
              <Typography variant="h6" sx={{ color: "primary.main" }}>
                Enter Your Passcode
              </Typography>
            </Box>
            <Stack gap={1}>
              <Box>
                <MuiOtpInput
                  name="passcode"
                  length={OTPLENGTH}
                  value={passcode}
                  onChange={handleInput}
                />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
