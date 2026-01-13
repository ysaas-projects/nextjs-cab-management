// src/features/auth/authSelectors.ts

import { RootState } from "@/store";

export const selectAuthUser = (state: RootState) => state.auth.user;
