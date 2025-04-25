import React from "react";
import { MotiView } from "moti";
import { Divider } from "react-native-paper";
import { useClinicsState } from "../../atoms/store";
import ClinicPerformanceCard from "./ClinicPerformanceCard";
import ClinicFilterChips from "./ClinicFilterChips";
import ClinicListHeader from "./ClinicListHeader";
import ClinicHeader from "./ClinicHeader";
import StatsSummary from "./StatsSummary";

/**
 * ListHeader component combines performance card, filter chips, and list header
 *
 * @param {Object} props - Component props
 * @param {string} props.selectedFilter - Currently selected filter
 * @param {Function} props.setSelectedFilter - Function to update selected filter
 * @param {number} props.clinicsCount - Number of clinics
 * @returns {JSX.Element} - Rendered component
 */
const ListHeader = ({
  selectedFilter,
  setSelectedFilter,
  clinicsCount,
  onRefresh,
  refreshing,
  totalPatients,
  totalAppointments,
  totalRevenue,
}) => {
  // Get ClnicData from the global state
  const [ClnicData] = useClinicsState();

  // Calculate total appointments and revenue
  // const totalAppointments =
  //   ClnicData?.reduce(
  //     (sum, clinic) => sum + (clinic.stats?.totalAppointments || 0),
  //     0
  //   ) || 0;

  // const totalRevenue =
  //   ClnicData?.reduce(
  //     (sum, clinic) => sum + (clinic.stats?.totalRevenue || 0),
  //     0
  //   ) || 0;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 5 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 400 }}
    >
      <ClinicHeader onRefresh={onRefresh} refreshing={refreshing}>
        {/* Stats summary component */}
        {ClnicData?.length > 0 && (
          <StatsSummary
            clinicsCount={ClnicData.length}
            patientsCount={totalPatients}
            appointmentsCount={totalAppointments}
            revenue={totalRevenue}
          />
        )}
      </ClinicHeader>

      {/* Divider */}
      <Divider style={{ marginTop: 16 }} />

      {/* Clinic Performance Card */}
      <ClinicPerformanceCard
        appointmentsCount={totalAppointments}
        revenue={totalRevenue}
      />

      {/* Filter Chips */}
      <ClinicFilterChips
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />

      {/* Clinics List Header */}
      <ClinicListHeader clinicsCount={clinicsCount} />
    </MotiView>
  );
};

export default ListHeader;
