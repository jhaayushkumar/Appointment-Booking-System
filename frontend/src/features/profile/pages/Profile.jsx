import React, { useEffect, useMemo, useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  MenuItem,
  Stack,
} from "@mui/material";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import {
  getPatientProfile,
  updatePatientProfile,
} from "../../patient/api/patient.api";
import {
  getDoctorProfile,
  updateDoctorProfile,
} from "../../doctor/api/doctor.api";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isPatient = user?.role === "patient";

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        setLoading(true);
        if (isPatient) {
          const data = await getPatientProfile();
          setProfile((prev) => ({
            ...prev,
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            age: data.age ?? "",
            gender: data.gender || "",
          }));
        } else {
          const data = await getDoctorProfile();
          const doctor = data?.doctor ?? data ?? {};
          setProfile((prev) => ({
            ...prev,
            name: doctor.name || "",
            email: doctor.email || "",
            phone: doctor.phone || "",
            age: "",
            gender: "",
          }));
        }
      } catch (error) {
        console.error("Failed to load profile", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, isPatient]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      if (isPatient) {
        await updatePatientProfile({
          name: profile.name,
          phone: profile.phone,
          age: profile.age,
          gender: profile.gender,
        });
      } else {
        await updateDoctorProfile({
          name: profile.name,
          phone: profile.phone,
        });
      }
      toast.success("Profile updated");
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error("Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  const avatarInitial = useMemo(
    () => profile.name?.charAt(0)?.toUpperCase() || "U",
    [profile.name]
  );

  if (loading) {
    return (
      <Box p={3} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3} maxWidth={640} mx="auto">
      <Stack direction="row" spacing={2} alignItems="center" mb={3}>
        <Avatar sx={{ width: 80, height: 80, fontSize: "2rem" }}>
          {avatarInitial}
        </Avatar>
        <Box>
          <Typography variant="h5">{profile.name || "Your Name"}</Typography>
          <Typography color="text.secondary">{profile.email}</Typography>
          <Typography color="text.secondary" variant="body2">
            {user?.role === "doctor" ? "Doctor" : "Patient"}
          </Typography>
        </Box>
      </Stack>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Full Name"
          name="name"
          value={profile.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          value={profile.email}
          fullWidth
          disabled
        />
        <TextField
          label="Phone"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          fullWidth
        />

        {isPatient && (
          <>
            <TextField
              label="Age"
              name="age"
              type="number"
              value={profile.age}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Gender"
              name="gender"
              select
              value={profile.gender}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="">Select gender</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ alignSelf: "flex-start" }}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;
