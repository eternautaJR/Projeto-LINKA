import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BarChart3,
  BedDouble,
  Building2,
  CalendarDays,
  CarFront,
  ChevronDown,
  DoorOpen,
  ExternalLink,
  FileText,
  Gauge,
  Handshake,
  Home,
  Info,
  Landmark,
  ListChecks,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Router, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";

const LOGO_URL = `${import.meta.env.BASE_URL}logobdnovo.png`;
const LINKA_LOGO_URL = `${import.meta.env.BASE_URL}linka-imoveis.png`;

const condominiumTabs = ["Concept", "Latitud", "Mudrá", "Orygem"] as const;
type Condominium = (typeof condominiumTabs)[number];
type MainPage = "Informações" | "Condomínios" | "Anúncios ativos" | "Divulgue com a gente";

type SaleRow = {
  unit: string;
  date: string;
  value: string;
  pricePerM2: string;
  area: string;
  complement: string;
  position: string;
  solarOrientation?: "Nascente" | "Poente";
};

type SaleSortKey = "unit" | "date" | "value" | "area" | "pricePerM2" | "position" | "solarOrientation";
type SortDirection = "asc" | "desc";

const latitudSales: SaleRow[] = [
  { unit: "Blc 2 Apt 403", date: "07/09/2026", value: "R$ 1.932.903,92", pricePerM2: "R$ 12.390,41", area: "156 m²", complement: "Bloco 2 • Apt 403", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 2 Apt 902", date: "07/06/2026", value: "R$ 2.600.000,00", pricePerM2: "R$ 16.666,67", area: "156 m²", complement: "Bloco 2 • Apt 902", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 2 Apt 403", date: "17/05/2026", value: "R$ 2.168.000,00", pricePerM2: "R$ 13.897,44", area: "156 m²", complement: "Bloco 2 • Apt 403", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 4 Apt 303", date: "21/04/2026", value: "R$ 2.550.000,00", pricePerM2: "R$ 13.636,36", area: "187 m²", complement: "Bloco 4 • Apt 303", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 2 Apt 801", date: "17/03/2026", value: "R$ 2.300.000,00", pricePerM2: "R$ 15.032,68", area: "153 m²", complement: "Bloco 2 • Apt 801", position: "Frente", solarOrientation: "Poente" },
  { unit: "Blc 4 Apt 1001", date: "27/07/2026", value: "R$ 4.115.100,00", pricePerM2: "R$ 11.062,10", area: "372 m²", complement: "Bloco 4 • Apt 1001", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 1 Apt 903", date: "26/07/2026", value: "R$ 2.122.302,77", pricePerM2: "R$ 16.978,42", area: "125 m²", complement: "Bloco 1 • Apt 903", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 3 Apt 204", date: "10/06/2026", value: "R$ 1.500.000,00", pricePerM2: "R$ 12.396,69", area: "121 m²", complement: "Bloco 3 • Apt 204", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 3 Apt 202", date: "31/05/2026", value: "R$ 1.531.200,00", pricePerM2: "R$ 12.760,00", area: "120 m²", complement: "Bloco 3 • Apt 202", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 1 Apt 402", date: "27/05/2026", value: "R$ 1.670.000,00", pricePerM2: "R$ 13.801,65", area: "121 m²", complement: "Bloco 1 • Apt 402", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 3 Apt 105", date: "18/05/2026", value: "R$ 1.611.242,60", pricePerM2: "R$ 13.316,05", area: "121 m²", complement: "Bloco 3 • Apt 105", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 401", date: "11/05/2026", value: "R$ 1.487.357,60", pricePerM2: "R$ 12.394,65", area: "120 m²", complement: "Bloco 3 • Apt 401", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 1 Apt 105", date: "05/04/2026", value: "R$ 1.750.000,00", pricePerM2: "R$ 14.583,33", area: "120 m²", complement: "Bloco 1 • Apt 105", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 906", date: "11/03/2026", value: "R$ 1.609.204,06", pricePerM2: "R$ 13.082,96", area: "123 m²", complement: "Bloco 3 • Apt 906", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 906", date: "11/03/2026", value: "R$ 1.601.147,74", pricePerM2: "R$ 13.342,90", area: "120 m²", complement: "Bloco 3 • Apt 906", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 401", date: "22/02/2026", value: "R$ 1.686.600,60", pricePerM2: "R$ 14.055,01", area: "120 m²", complement: "Bloco 3 • Apt 401", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 204", date: "03/02/2026", value: "R$ 1.600.000,00", pricePerM2: "R$ 13.008,13", area: "123 m²", complement: "Bloco 3 • Apt 204", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 1 Apt 105", date: "29/12/2025", value: "R$ 1.574.678,27", pricePerM2: "R$ 13.013,87", area: "121 m²", complement: "Bloco 1 • Apt 105", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 203", date: "10/12/2025", value: "R$ 2.228.070,00", pricePerM2: "R$ 17.824,56", area: "125 m²", complement: "Bloco 3 • Apt 203", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 3 Apt 402", date: "12/11/2025", value: "R$ 1.671.995,00", pricePerM2: "R$ 13.933,29", area: "120 m²", complement: "Bloco 3 • Apt 402", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 3 Apt 906", date: "03/11/2025", value: "R$ 1.586.169,30", pricePerM2: "R$ 12.895,69", area: "123 m²", complement: "Bloco 3 • Apt 906", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 1 Apt 203", date: "23/10/2025", value: "R$ 1.696.500,00", pricePerM2: "R$ 13.572,00", area: "125 m²", complement: "Bloco 1 • Apt 203", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 3 Apt 305", date: "23/10/2025", value: "R$ 1.696.500,00", pricePerM2: "R$ 14.020,66", area: "121 m²", complement: "Bloco 3 • Apt 305", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 1 Apt 603", date: "16/10/2025", value: "R$ 1.502.776,55", pricePerM2: "R$ 12.022,21", area: "125 m²", complement: "Bloco 1 • Apt 603", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 3 Apt 1003", date: "08/09/2025", value: "R$ 1.650.000,00", pricePerM2: "R$ 13.200,00", area: "125 m²", complement: "Bloco 3 • Apt 1003", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 4 Apt 1002", date: "13/07/2025", value: "R$ 4.905.537,66", pricePerM2: "R$ 13.186,93", area: "372 m²", complement: "Bloco 4 • Apt 1002", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 806", date: "13/07/2025", value: "R$ 1.843.395,61", pricePerM2: "R$ 14.986,96", area: "123 m²", complement: "Bloco 3 • Apt 806", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 1 Apt 101", date: "01/07/2025", value: "R$ 1.569.917,86", pricePerM2: "R$ 13.082,65", area: "120 m²", complement: "Bloco 1 • Apt 101", position: "Frente", solarOrientation: "Nascente" },
  { unit: "Blc 1 Apt 502", date: "07/05/2025", value: "R$ 1.833.717,67", pricePerM2: "R$ 15.280,98", area: "120 m²", complement: "Bloco 1 • Apt 502", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 1 Apt 402", date: "07/05/2025", value: "R$ 1.816.555,50", pricePerM2: "R$ 15.137,96", area: "120 m²", complement: "Bloco 1 • Apt 402", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 3 Apt 606", date: "07/05/2025", value: "R$ 1.637.014,95", pricePerM2: "R$ 13.309,06", area: "123 m²", complement: "Bloco 3 • Apt 606", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 301", date: "07/05/2025", value: "R$ 1.872.601,99", pricePerM2: "R$ 15.605,02", area: "120 m²", complement: "Bloco 3 • Apt 301", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 4 Apt 304", date: "14/04/2025", value: "R$ 2.523.072,40", pricePerM2: "R$ 13.638,23", area: "185 m²", complement: "Bloco 4 • Apt 304", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 1 Apt 502", date: "27/04/2025", value: "R$ 1.810.674,12", pricePerM2: "R$ 15.088,95", area: "120 m²", complement: "Bloco 1 • Apt 502", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 2 Apt 604", date: "07/04/2025", value: "R$ 2.000.000,00", pricePerM2: "R$ 13.071,90", area: "153 m²", complement: "Bloco 2 • Apt 604", position: "Frente", solarOrientation: "Poente" },
  { unit: "Blc 1 Apt 402", date: "24/04/2025", value: "R$ 1.793.514,48", pricePerM2: "R$ 14.945,95", area: "120 m²", complement: "Bloco 1 • Apt 402", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 2 Apt 603", date: "20/03/2025", value: "R$ 2.100.000,00", pricePerM2: "R$ 13.461,54", area: "156 m²", complement: "Bloco 2 • Apt 603", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 204", date: "16/04/2025", value: "R$ 1.602.250,00", pricePerM2: "R$ 13.241,74", area: "121 m²", complement: "Bloco 3 • Apt 204", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 4 Apt 503", date: "16/02/2025", value: "R$ 2.767.385,00", pricePerM2: "R$ 14.798,85", area: "187 m²", complement: "Bloco 4 • Apt 503", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 2 Apt 103", date: "09/02/2025", value: "R$ 1.691.276,20", pricePerM2: "R$ 10.841,51", area: "156 m²", complement: "Bloco 2 • Apt 103", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 2 Apt 204", date: "30/01/2025", value: "R$ 1.642.084,00", pricePerM2: "R$ 10.732,58", area: "153 m²", complement: "Bloco 2 • Apt 204", position: "Frente", solarOrientation: "Poente" },
  { unit: "Blc 2 Apt 101", date: "28/01/2025", value: "R$ 2.320.809,50", pricePerM2: "R$ 15.168,69", area: "153 m²", complement: "Bloco 2 • Apt 101", position: "Frente", solarOrientation: "Poente" },
  { unit: "Blc 1 Apt 801", date: "02/04/2025", value: "R$ 1.843.644,50", pricePerM2: "R$ 15.363,70", area: "120 m²", complement: "Bloco 1 • Apt 801", position: "Frente", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 102", date: "20/02/2025", value: "R$ 1.570.000,00", pricePerM2: "R$ 13.083,33", area: "120 m²", complement: "Bloco 3 • Apt 102", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 1 Apt 1004", date: "21/01/2025", value: "R$ 1.734.206,61", pricePerM2: "R$ 14.332,29", area: "121 m²", complement: "Bloco 1 • Apt 1004", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 3 Apt 1003", date: "12/01/2025", value: "R$ 1.728.048,73", pricePerM2: "R$ 13.824,39", area: "125 m²", complement: "Bloco 3 • Apt 1003", position: "Fundos", solarOrientation: "Poente" },
];

const conceptSales: SaleRow[] = [
  { unit: "Blc 1 Apt 0401", date: "02/08/2026", value: "R$ 2.530.612,30", pricePerM2: "R$ 13.678,99", area: "185 m²", complement: "Bloco 1 • Apt 0401", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 1 Apt 0605", date: "14/05/2026", value: "R$ 2.035.994,00", pricePerM2: "R$ 13.307,15", area: "153 m²", complement: "Bloco 1 • Apt 0605", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 1 Apt 0903", date: "11/05/2026", value: "R$ 3.595.076,40", pricePerM2: "R$ 13.880,60", area: "259 m²", complement: "Bloco 1 • Apt 0903", position: "Frente", solarOrientation: "Nascente" },
  { unit: "Blc 1 Apt 0804", date: "11/05/2026", value: "R$ 2.187.360,00", pricePerM2: "R$ 14.112,00", area: "155 m²", complement: "Bloco 1 • Apt 0804", position: "Frente", solarOrientation: "Poente" },
  { unit: "Blc 2 Apt 0301", date: "19/03/2026", value: "R$ 2.866.750,00", pricePerM2: "R$ 13.984,15", area: "205 m²", complement: "Bloco 2 • Apt 0301", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 1 Apt 0302", date: "05/02/2026", value: "R$ 2.513.257,60", pricePerM2: "R$ 13.585,18", area: "185 m²", complement: "Bloco 1 • Apt 0302", position: "Frente", solarOrientation: "Nascente" },
  { unit: "Blc 2 Apt 0603", date: "11/01/2026", value: "R$ 2.848.197,44", pricePerM2: "R$ 13.893,65", area: "205 m²", complement: "Bloco 2 • Apt 0603", position: "Fundos", solarOrientation: "Poente" },
];

const mudraSales: SaleRow[] = [
  { unit: "Blc 1 Apt 505", date: "25/08/2026", value: "R$ 1.250.000,00", pricePerM2: "R$ 16.025,64", area: "78 m²", complement: "Bloco 1 • Apt 505", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 1 Apt 410", date: "12/08/2026", value: "R$ 950.000,00", pricePerM2: "R$ 12.025,32", area: "79 m²", complement: "Bloco 1 • Apt 410", position: "Frente", solarOrientation: "Poente" },
  { unit: "Blc 2 Apt 602", date: "02/08/2026", value: "R$ 1.450.000,00", pricePerM2: "R$ 13.679,25", area: "106 m²", complement: "Bloco 2 • Apt 602", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 2 Apt 403", date: "11/06/2026", value: "R$ 1.550.000,00", pricePerM2: "R$ 14.622,64", area: "106 m²", complement: "Bloco 2 • Apt 403", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 2 Apt 705", date: "01/06/2026", value: "R$ 1.450.000,00", pricePerM2: "R$ 15.934,07", area: "91 m²", complement: "Bloco 2 • Apt 705", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 1 Apt 808", date: "07/05/2026", value: "R$ 1.125.000,00", pricePerM2: "R$ 14.423,08", area: "78 m²", complement: "Bloco 1 • Apt 808", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 2 Apt 804", date: "24/02/2026", value: "R$ 1.412.602,80", pricePerM2: "R$ 15.354,38", area: "92 m²", complement: "Bloco 2 • Apt 804", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 2 Apt 302", date: "28/01/2026", value: "R$ 1.286.761,60", pricePerM2: "R$ 12.139,26", area: "106 m²", complement: "Bloco 2 • Apt 302", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 1 Apt 102", date: "06/10/2025", value: "R$ 1.071.827,97", pricePerM2: "R$ 13.741,38", area: "78 m²", complement: "Bloco 1 • Apt 102", position: "Frente", solarOrientation: "Poente" },
  { unit: "Blc 2 Apt 306", date: "02/09/2025", value: "R$ 1.324.600,00", pricePerM2: "R$ 12.496,23", area: "106 m²", complement: "Bloco 2 • Apt 306", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 1 Apt 105", date: "27/08/2025", value: "R$ 1.150.000,00", pricePerM2: "R$ 14.743,59", area: "78 m²", complement: "Bloco 1 • Apt 105", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 1 Apt 402", date: "06/08/2025", value: "R$ 1.069.062,22", pricePerM2: "R$ 13.705,93", area: "78 m²", complement: "Bloco 1 • Apt 402", position: "Frente", solarOrientation: "Poente" },
  { unit: "Blc 2 Apt 407", date: "21/07/2025", value: "R$ 1.540.638,59", pricePerM2: "R$ 14.534,33", area: "106 m²", complement: "Bloco 2 • Apt 407", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 1 Apt 201", date: "30/06/2025", value: "R$ 1.097.184,63", pricePerM2: "R$ 13.888,41", area: "79 m²", complement: "Bloco 1 • Apt 201", position: "Frente", solarOrientation: "Poente" },
  { unit: "Blc 1 Apt 310", date: "12/05/2025", value: "R$ 1.075.745,00", pricePerM2: "R$ 13.617,03", area: "79 m²", complement: "Bloco 1 • Apt 310", position: "Frente", solarOrientation: "Poente" },
  { unit: "Blc 2 Apt 407", date: "21/04/2025", value: "R$ 1.490.000,00", pricePerM2: "R$ 14.056,60", area: "106 m²", complement: "Bloco 2 • Apt 407", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 1 Apt 309", date: "31/03/2025", value: "R$ 1.075.035,00", pricePerM2: "R$ 13.782,50", area: "78 m²", complement: "Bloco 1 • Apt 309", position: "Frente", solarOrientation: "Poente" },
  { unit: "Blc 1 Apt 502", date: "23/03/2025", value: "R$ 1.112.336,41", pricePerM2: "R$ 14.260,72", area: "78 m²", complement: "Bloco 1 • Apt 502", position: "Frente", solarOrientation: "Poente" },
  { unit: "Blc 1 Apt 710", date: "06/03/2025", value: "R$ 984.141,00", pricePerM2: "R$ 12.457,48", area: "79 m²", complement: "Bloco 1 • Apt 710", position: "Frente", solarOrientation: "Poente" },
  { unit: "Blc 2 Apt 702", date: "06/03/2025", value: "R$ 1.485.804,30", pricePerM2: "R$ 14.017,02", area: "106 m²", complement: "Bloco 2 • Apt 702", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 2 Apt 803", date: "19/02/2025", value: "R$ 1.473.129,46", pricePerM2: "R$ 13.897,45", area: "106 m²", complement: "Bloco 2 • Apt 803", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 2 Apt 105", date: "13/02/2025", value: "R$ 1.244.972,28", pricePerM2: "R$ 13.681,01", area: "91 m²", complement: "Bloco 2 • Apt 105", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 2 Apt 402", date: "12/02/2025", value: "R$ 1.304.380,01", pricePerM2: "R$ 12.305,47", area: "106 m²", complement: "Bloco 2 • Apt 402", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 1 Apt 403", date: "12/02/2025", value: "R$ 1.093.684,16", pricePerM2: "R$ 13.671,05", area: "80 m²", complement: "Bloco 1 • Apt 403", position: "Frente", solarOrientation: "Poente" },
  { unit: "Blc 1 Apt 207", date: "05/02/2025", value: "R$ 1.066.721,20", pricePerM2: "R$ 13.334,02", area: "80 m²", complement: "Bloco 1 • Apt 207", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 1 Apt 103", date: "13/01/2025", value: "R$ 1.021.858,50", pricePerM2: "R$ 12.773,23", area: "80 m²", complement: "Bloco 1 • Apt 103", position: "Frente", solarOrientation: "Poente" },
  { unit: "Blc 1 Apt 410", date: "12/01/2025", value: "R$ 1.032.769,00", pricePerM2: "R$ 13.073,03", area: "79 m²", complement: "Bloco 1 • Apt 410", position: "Frente", solarOrientation: "Poente" },
  { unit: "Blc 1 Apt 301", date: "02/01/2025", value: "R$ 1.000.000,00", pricePerM2: "R$ 12.658,23", area: "79 m²", complement: "Bloco 1 • Apt 301", position: "Frente", solarOrientation: "Poente" },
  { unit: "Blc 1 Apt 305", date: "01/01/2025", value: "R$ 1.163.384,83", pricePerM2: "R$ 14.915,19", area: "78 m²", complement: "Bloco 1 • Apt 305", position: "Fundos", solarOrientation: "Nascente" },
];

const orygemSales: SaleRow[] = [
  { unit: "Blc 3 Apt 802", date: "19/08/2026", value: "R$ 1.750.408,30", pricePerM2: "R$ 14.230,96", area: "123 m²", complement: "Bloco 3 • Apt 802", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 606", date: "13/08/2026", value: "R$ 2.014.816,40", pricePerM2: "R$ 15.990,61", area: "126 m²", complement: "Bloco 3 • Apt 606", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 3 Apt 501", date: "09/08/2026", value: "R$ 1.680.000,00", pricePerM2: "R$ 13.658,54", area: "123 m²", complement: "Bloco 3 • Apt 501", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 3 Apt 405", date: "12/07/2026", value: "R$ 1.704.045,00", pricePerM2: "R$ 13.742,30", area: "124 m²", complement: "Bloco 3 • Apt 405", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 3 Apt 902", date: "18/06/2026", value: "R$ 1.765.800,00", pricePerM2: "R$ 14.356,10", area: "123 m²", complement: "Bloco 3 • Apt 902", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 1103", date: "15/06/2026", value: "R$ 2.960.831,41", pricePerM2: "R$ 16.091,48", area: "184 m²", complement: "Bloco 3 • Apt 1103", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 904", date: "04/06/2026", value: "R$ 1.852.523,63", pricePerM2: "R$ 14.939,71", area: "124 m²", complement: "Bloco 3 • Apt 904", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 204", date: "25/05/2026", value: "R$ 1.787.337,75", pricePerM2: "R$ 14.414,01", area: "124 m²", complement: "Bloco 3 • Apt 204", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 305", date: "24/05/2026", value: "R$ 1.869.417,00", pricePerM2: "R$ 15.075,94", area: "124 m²", complement: "Bloco 3 • Apt 305", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 3 Apt 302", date: "21/05/2026", value: "R$ 1.668.685,98", pricePerM2: "R$ 13.566,55", area: "123 m²", complement: "Bloco 3 • Apt 302", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 104", date: "20/05/2026", value: "R$ 1.530.300,00", pricePerM2: "R$ 12.341,13", area: "124 m²", complement: "Bloco 3 • Apt 104", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 703", date: "20/05/2026", value: "R$ 1.687.332,40", pricePerM2: "R$ 13.286,08", area: "127 m²", complement: "Bloco 3 • Apt 703", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 906", date: "17/05/2026", value: "R$ 1.558.310,40", pricePerM2: "R$ 12.367,54", area: "126 m²", complement: "Bloco 3 • Apt 906", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 3 Apt 403", date: "11/05/2026", value: "R$ 1.717.983,70", pricePerM2: "R$ 13.527,43", area: "127 m²", complement: "Bloco 3 • Apt 403", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 1004", date: "26/04/2026", value: "R$ 2.004.235,53", pricePerM2: "R$ 16.163,19", area: "124 m²", complement: "Bloco 3 • Apt 1004", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 601", date: "19/04/2026", value: "R$ 1.785.388,70", pricePerM2: "R$ 14.515,36", area: "123 m²", complement: "Bloco 3 • Apt 601", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 3 Apt 1003", date: "13/04/2026", value: "R$ 1.700.000,00", pricePerM2: "R$ 13.385,83", area: "127 m²", complement: "Bloco 3 • Apt 1003", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 705", date: "12/04/2026", value: "R$ 1.811.902,77", pricePerM2: "R$ 14.612,12", area: "124 m²", complement: "Bloco 3 • Apt 705", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 3 Apt 604", date: "09/04/2026", value: "R$ 1.976.273,16", pricePerM2: "R$ 15.937,69", area: "124 m²", complement: "Bloco 3 • Apt 604", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 702", date: "09/04/2026", value: "R$ 1.941.513,35", pricePerM2: "R$ 15.784,66", area: "123 m²", complement: "Bloco 3 • Apt 702", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 502", date: "01/04/2026", value: "R$ 1.715.182,40", pricePerM2: "R$ 13.944,57", area: "123 m²", complement: "Bloco 3 • Apt 502", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 102", date: "23/03/2026", value: "R$ 1.762.919,71", pricePerM2: "R$ 14.332,68", area: "123 m²", complement: "Bloco 3 • Apt 102", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 402", date: "23/03/2026", value: "R$ 1.825.635,75", pricePerM2: "R$ 14.842,57", area: "123 m²", complement: "Bloco 3 • Apt 402", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 704", date: "22/03/2026", value: "R$ 1.793.512,34", pricePerM2: "R$ 14.463,81", area: "124 m²", complement: "Bloco 3 • Apt 704", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 803", date: "18/03/2026", value: "R$ 1.936.660,87", pricePerM2: "R$ 15.249,30", area: "127 m²", complement: "Bloco 3 • Apt 803", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 505", date: "17/03/2026", value: "R$ 1.762.475,00", pricePerM2: "R$ 14.213,51", area: "124 m²", complement: "Bloco 3 • Apt 505", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 3 Apt 103", date: "15/03/2026", value: "R$ 1.640.000,00", pricePerM2: "R$ 12.913,39", area: "127 m²", complement: "Bloco 3 • Apt 103", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 202", date: "10/03/2026", value: "R$ 1.565.373,01", pricePerM2: "R$ 12.726,61", area: "123 m²", complement: "Bloco 3 • Apt 202", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 303", date: "10/03/2026", value: "R$ 1.715.713,33", pricePerM2: "R$ 13.509,55", area: "127 m²", complement: "Bloco 3 • Apt 303", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 603", date: "10/03/2026", value: "R$ 1.915.197,27", pricePerM2: "R$ 15.080,29", area: "127 m²", complement: "Bloco 3 • Apt 603", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 304", date: "09/03/2026", value: "R$ 1.650.917,60", pricePerM2: "R$ 13.313,85", area: "124 m²", complement: "Bloco 3 • Apt 304", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 1102", date: "04/03/2026", value: "R$ 2.753.673,39", pricePerM2: "R$ 15.047,40", area: "183 m²", complement: "Bloco 3 • Apt 1102", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 706", date: "04/03/2026", value: "R$ 1.944.014,93", pricePerM2: "R$ 15.428,69", area: "126 m²", complement: "Bloco 3 • Apt 706", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 3 Apt 401", date: "03/03/2026", value: "R$ 1.621.960,00", pricePerM2: "R$ 13.186,67", area: "123 m²", complement: "Bloco 3 • Apt 401", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 3 Apt 804", date: "01/03/2026", value: "R$ 1.658.063,94", pricePerM2: "R$ 13.371,48", area: "124 m²", complement: "Bloco 3 • Apt 804", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 805", date: "25/02/2026", value: "R$ 1.713.241,14", pricePerM2: "R$ 13.816,46", area: "124 m²", complement: "Bloco 3 • Apt 805", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 3 Apt 1002", date: "24/02/2026", value: "R$ 1.930.906,20", pricePerM2: "R$ 15.698,42", area: "123 m²", complement: "Bloco 3 • Apt 1002", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 602", date: "12/02/2026", value: "R$ 1.720.538,69", pricePerM2: "R$ 13.988,12", area: "123 m²", complement: "Bloco 3 • Apt 602", position: "Fundos", solarOrientation: "Nascente" },
  { unit: "Blc 3 Apt 801", date: "10/02/2026", value: "R$ 1.781.571,43", pricePerM2: "R$ 14.484,32", area: "123 m²", complement: "Bloco 3 • Apt 801", position: "Fundos", solarOrientation: "Poente" },
  { unit: "Blc 1 Apt 1101", date: "14/08/2025", value: "R$ 2.905.195,69", pricePerM2: "R$ 15.371,41", area: "189 m²", complement: "Bloco 1 • Apt 1101", position: "Frente", solarOrientation: "Poente" },
];

const conceptAreaRanges = [
  { label: "151–155 m²", minimum: 151, maximum: 155 },
  { label: "185 m²", minimum: 185, maximum: 185 },
  { label: "204–206 m²", minimum: 204, maximum: 206 },
  { label: "259–287 m²", minimum: 259, maximum: 287 },
  { label: "413–414 m²", minimum: 413, maximum: 414 },
];

const conceptAreaMetadata = {
  "151–155 m²": { category: "Apartamento", detail: "3 suítes" },
  "185 m²": { category: "Apartamento", detail: "4 quartos" },
  "204–206 m²": { category: "Apartamento", detail: "4 suítes" },
  "259–287 m²": { category: "Cobertura", detail: "3 suítes" },
  "413–414 m²": { category: "Cobertura", detail: "4 suítes" },
};

const latitudAreaRanges = [
  { label: "120–125 m²", minimum: 120, maximum: 125 },
  { label: "153–156 m²", minimum: 153, maximum: 156 },
  { label: "184–187 m²", minimum: 184, maximum: 187 },
  { label: "180–183 m²", minimum: 180, maximum: 183 },
  { label: "309 m²", minimum: 309, maximum: 309 },
  { label: "372 m²", minimum: 372, maximum: 372 },
];

const latitudAreaMetadata = {
  "120–125 m²": { category: "Apartamento", detail: "3 quartos" },
  "153–156 m²": { category: "Apartamento", detail: "4 quartos" },
  "184–187 m²": { category: "Apartamento", detail: "4 quartos" },
  "180–183 m²": { category: "Cobertura", detail: "3 suítes" },
  "309 m²": { category: "Cobertura", detail: "4 suítes" },
  "372 m²": { category: "Cobertura", detail: "4 suítes" },
};

const mudraAreaRanges = [
  { label: "78–80 m²", minimum: 78, maximum: 80 },
  { label: "91–106 m²", minimum: 91, maximum: 106 },
  { label: "177–221 m²", minimum: 177, maximum: 221 },
];

const mudraAreaMetadata = {
  "78–80 m²": { category: "Apartamento", detail: "2 quartos" },
  "91–106 m²": { category: "Apartamento", detail: "3 quartos" },
  "177–221 m²": { category: "Cobertura", detail: "3 quartos" },
};

const orygemAreaRanges = [
  { label: "120–126 m²", minimum: 120, maximum: 126 },
  { label: "153–158 m²", minimum: 153, maximum: 158 },
  { label: "187–190 m²", minimum: 187, maximum: 190 },
  { label: "184–188 m²", minimum: 184, maximum: 188 },
  { label: "314–378 m²", minimum: 314, maximum: 378 },
];

const orygemAreaMetadata = {
  "120–126 m²": { category: "Apartamento", detail: "3 quartos" },
  "153–158 m²": { category: "Apartamento", detail: "4 quartos" },
  "187–190 m²": { category: "Apartamento", detail: "4 quartos" },
  "184–188 m²": { category: "Cobertura", detail: "3 suítes" },
  "314–378 m²": { category: "Cobertura", detail: "4 suítes" },
};

function salesInAreaRange(sales: SaleRow[], minimum: number, maximum: number) {
  return sales.filter((sale) => {
    const area = Number.parseFloat(sale.area.replace(" m²", "").replace(",", "."));
    return area >= minimum && area <= maximum;
  });
}

const orygemAverageValues = Object.fromEntries(orygemAreaRanges.map(({ label, minimum, maximum }) => {
  const matchingSales = salesInAreaRange(orygemSales, minimum, maximum);
  if (matchingSales.length === 0) return [label, "Sem dados recentes"];
  const total = matchingSales.reduce((sum, sale) => sum + Number.parseFloat(sale.value.replace(/R\$\s?/g, "").replace(/\./g, "").replace(",", ".")), 0);
  return [label, new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total / matchingSales.length)];
}));

const orygemTransactionCounts = Object.fromEntries(orygemAreaRanges.map(({ label, minimum, maximum }) => [label, salesInAreaRange(orygemSales, minimum, maximum).length]));

const conceptAverageValues = Object.fromEntries(conceptAreaRanges.map(({ label, minimum, maximum }) => {
  const matchingSales = salesInAreaRange(conceptSales, minimum, maximum);
  if (matchingSales.length === 0) return [label, "Sem dados recentes"];
  const total = matchingSales.reduce((sum, sale) => sum + Number.parseFloat(sale.value.replace(/R\$\s?/g, "").replace(/\./g, "").replace(",", ".")), 0);
  return [label, new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total / matchingSales.length)];
}));

const conceptTransactionCounts = Object.fromEntries(conceptAreaRanges.map(({ label, minimum, maximum }) => [label, salesInAreaRange(conceptSales, minimum, maximum).length]));

const latitudAverageValues = Object.fromEntries(latitudAreaRanges.map(({ label, minimum, maximum }) => {
  const matchingSales = salesInAreaRange(latitudSales, minimum, maximum);
  if (matchingSales.length === 0) return [label, "Sem dados recentes"];
  const total = matchingSales.reduce((sum, sale) => sum + Number.parseFloat(sale.value.replace(/R\$\s?/g, "").replace(/\./g, "").replace(",", ".")), 0);
  return [label, new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total / matchingSales.length)];
}));

const latitudTransactionCounts = Object.fromEntries(latitudAreaRanges.map(({ label, minimum, maximum }) => [label, salesInAreaRange(latitudSales, minimum, maximum).length]));

const mudraAverageValues = Object.fromEntries(mudraAreaRanges.map(({ label, minimum, maximum }) => {
  const matchingSales = salesInAreaRange(mudraSales, minimum, maximum);
  if (matchingSales.length === 0) return [label, "Sem dados recentes"];
  const total = matchingSales.reduce((sum, sale) => sum + Number.parseFloat(sale.value.replace(/R\$\s?/g, "").replace(/\./g, "").replace(",", ".")), 0);
  return [label, new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total / matchingSales.length)];
}));

const mudraTransactionCounts = Object.fromEntries(mudraAreaRanges.map(({ label, minimum, maximum }) => [label, salesInAreaRange(mudraSales, minimum, maximum).length]));

function elapsedAgeFrom(month: number, year: number) {
  const today = new Date();
  let months = (today.getFullYear() - year) * 12 + today.getMonth() - month;
  if (today.getDate() < 1) months -= 1;
  months = Math.max(0, months);
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return `${years} ${years === 1 ? "ano" : "anos"} e ${remainingMonths} ${remainingMonths === 1 ? "mês" : "meses"}`;
}

const navIcons: Record<MainPage, LucideIcon> = {
  Informações: BarChart3,
  Condomínios: Building2,
  "Anúncios ativos": Home,
  "Divulgue com a gente": Handshake,
};

function condoToSlug(condo: Condominium) {
  return condo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function pageToPath(page: MainPage) {
  if (page === "Informações") return "/";
  if (page === "Condomínios") return "/condominios";
  if (page === "Anúncios ativos") return "/anuncios-ativos";
  return "/avalie-com-a-gente";
}

function getRouteState(path: string): { page: MainPage; condo: Condominium } {
  const condo = condominiumTabs.find((item) => path === `/empreendimentos/${condoToSlug(item)}`);
  if (condo) return { page: "Condomínios", condo };
  if (path === "/condominios") return { page: "Condomínios", condo: "Latitud" };
  if (path === "/anuncios-ativos") return { page: "Anúncios ativos", condo: "Latitud" };
  if (path === "/avalie-com-a-gente") return { page: "Divulgue com a gente", condo: "Latitud" };
  return { page: "Informações", condo: "Latitud" };
}

function DashboardApp() {
  const [location, setLocation] = useLocation();
  const routeState = getRouteState(location);
  const activePage = routeState.page;
  const activeCondo = routeState.condo;
  const showingCondo = location.startsWith("/empreendimentos/");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showCondominiumSubnav, setShowCondominiumSubnav] = useState(showingCondo);

  const pageTitle = useMemo(() => {
    if (activePage === "Informações") return "Informações";
    if (activePage === "Condomínios") return "Condomínios";
    if (activePage === "Anúncios ativos") return "Anúncios ativos";
    return "Divulgue com a gente";
  }, [activePage]);

  const navigate = (page: MainPage) => {
    setLocation(pageToPath(page));
    if (page !== "Condomínios") setShowCondominiumSubnav(false);
    setShowSidebar(false);
  };

  const navigateCondo = (condo: Condominium) => {
    setLocation(`/empreendimentos/${condoToSlug(condo)}`);
    setShowCondominiumSubnav(true);
    setShowSidebar(false);
  };

  const toggleCondominiums = () => {
    setShowCondominiumSubnav((current) => !current);
    if (activePage !== "Condomínios") setLocation(pageToPath("Condomínios"));
  };

  return (
    <div className="app-shell">
      <button className="mobile-menu-button" onClick={() => setShowSidebar((current) => !current)} aria-label="Abrir menu">
        <ListChecks size={19} />
      </button>
      <aside className={`sidebar ${showSidebar ? "sidebar-open" : ""}`}>
        <div className="brand-lockup">
          <img src={LINKA_LOGO_URL} alt="Linka Imóveis" />
        </div>
        <div className="sidebar-rule" />
        <nav className="main-nav" aria-label="Navegação principal">
          <button className={`nav-item ${activePage === "Informações" ? "active" : ""}`} onClick={() => navigate("Informações")}>
            <BarChart3 size={18} />
            <span>Informações</span>
          </button>
          <button className={`nav-item ${activePage === "Condomínios" ? "active" : ""}`} onClick={toggleCondominiums} aria-expanded={showCondominiumSubnav} aria-controls="condominium-subnav">
            <Building2 size={18} />
            <span>Condomínios</span>
            <ChevronDown className={`nav-expand-icon ${showCondominiumSubnav ? "open" : ""}`} size={16} />
          </button>
          {showCondominiumSubnav && (
            <div className="subnav" id="condominium-subnav" aria-label="Empreendimentos">
              {condominiumTabs.map((condo) => (
                <button
                  key={condo}
                  className={`subnav-item ${showingCondo && activeCondo === condo ? "selected" : ""}`}
                  onClick={() => {
                    navigateCondo(condo);
                  }}
                >
                  <span className="subnav-dot" />
                  <span>{condo}</span>
                </button>
              ))}
            </div>
          )}
          <button className={`nav-item ${activePage === "Anúncios ativos" ? "active" : ""}`} onClick={() => navigate("Anúncios ativos")}>
            <Home size={18} />
            <span>Anúncios ativos</span>
          </button>
          <button className={`nav-item ${activePage === "Divulgue com a gente" ? "active" : ""}`} onClick={() => navigate("Divulgue com a gente")}>
            <Handshake size={18} />
            <span>Divulgue com a gente</span>
          </button>
        </nav>
        <div className="sidebar-footer">
          <ShieldCheck size={15} />
          <span>Portal de transparência</span>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <span className="eyebrow">BLUEDOOR IMÓVEIS</span>
            <h1>{pageTitle}</h1>
          </div>
        </header>
        {activePage === "Informações" && <InformationPage />}
        {activePage === "Condomínios" && (showingCondo ? <CondominiumPage activeCondo={activeCondo} setActiveCondo={navigateCondo} /> : <CondominiumsPage onSelect={navigateCondo} />)}
        {activePage === "Anúncios ativos" && <ActiveListingsPage />}
        {activePage === "Divulgue com a gente" && <ContactPage />}
      </main>
    </div>
  );
}

function InformationPage() {
  return (
    <div className="content-stack">
      <section className="intro-banner">
        <div className="intro-icon"><Info size={25} /></div>
        <div>
          <p className="section-kicker">O que é</p>
          <h2>Quadro de anúncios na palma de sua mão</h2>
          <p>Esta plataforma centraliza informações dos empreendimentos e suas unidades em um só lugar. Cada subaba apresenta exclusivamente os dados do respectivo condomínio.</p>
        </div>
      </section>
      <section className="surface-card how-it-works">
        <div className="section-heading"><div><p className="section-kicker">Navegação guiada</p><h2>Como consultar</h2></div><Sparkles size={21} /></div>
        <div className="steps-grid">
          <Step number="01" title="Escolha um empreendimento" text="Abra Condomínios no menu lateral e escolha o de seu interesse." />
          <ArrowRight className="step-arrow" size={22} />
          <Step number="02" title="Consulte os dados" text="Visualize unidades, áreas por bloco, idade e vendas desde janeiro de 2025." />
          <ArrowRight className="step-arrow" size={22} />
          <Step number="03" title="Entre em contato" text="Encontrou o que precisava? Fale com a equipe da Bluedoor pela plataforma." />
        </div>
      </section>
      <section className="surface-card feature-overview">
        <div className="section-heading"><div><p className="section-kicker">O que você encontra</p><h2>Informação sem ruído</h2></div><FileText size={21} /></div>
        <div className="feature-grid">
          <FeatureItem icon={Building2} title="Unidades" text="Identificação, tipologia, área, valor e status." />
          <FeatureItem icon={Ruler} title="Áreas por bloco" text="Menor e maior área destacados por bloco quando necessário." />
          <FeatureItem icon={CalendarDays} title="Entrega e idade" text="Uma única referência, atualizada mês a mês." />
          <FeatureItem icon={BarChart3} title="Vendas desde jan/2025" text="Histórico organizado a partir de janeiro de 2025." />
        </div>
      </section>
      <div className="audience-grid">
        <AudienceCard icon={Users} title="Para moradores" text="Acompanhe informações do seu empreendimento com linguagem simples e visão organizada." />
        <AudienceCard icon={Handshake} title="Para parceiros" text="Consulte características, áreas e histórico antes de entrar em contato com a Bluedoor." />
        <AudienceCard icon={Landmark} title="Para administradoras" text="Tenha uma fonte central de consulta para dados do condomínio e de suas unidades." />
      </div>
    </div>
  );
}

function CondominiumsPage({ onSelect }: { onSelect: (condo: Condominium) => void }) {
  const summaries: Array<{ name: Condominium; units: string; address: string }> = [
    { name: "Concept", units: "77 unidades", address: "Avenida Rosauro Estellita, 35" },
    { name: "Latitud", units: "192 unidades", address: "Avenida Rosauro Estelita, 155" },
    { name: "Mudrá", units: "144 unidades", address: "Avenida Cândido Portinari, 60" },
    { name: "Orygem", units: "192 unidades", address: "Avenida Candido Portinari, 170" },
  ];

  return (
    <div className="content-stack">
      <section className="intro-banner">
        <div className="intro-icon"><Building2 size={25} /></div>
        <div><p className="section-kicker">Visão dos empreendimentos</p><h2>Condomínios</h2><p>Selecione um condomínio para consultar suas informações gerais, referências de valores e histórico de vendas.</p></div>
      </section>
      <section className="surface-card feature-overview">
        <div className="section-heading"><div><p className="section-kicker">Consulta rápida</p><h2>Escolha um condomínio</h2></div><Building2 size={21} /></div>
        <div className="feature-grid condominium-grid">
          {summaries.map((condo) => (
            <button className="feature-item condominium-link-card" key={condo.name} onClick={() => onSelect(condo.name)}>
              <div className="feature-icon"><Building2 size={20} /></div>
              <div><strong>{condo.name}</strong><p>{condo.units}<br />{condo.address}</p></div>
              <ArrowRight className="condominium-link-arrow" size={17} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function CondominiumPage({ activeCondo, setActiveCondo }: { activeCondo: Condominium; setActiveCondo: (condo: Condominium) => void }) {
  if (activeCondo === "Latitud") return <LatitudPage activeCondo={activeCondo} setActiveCondo={setActiveCondo} />;
  return <CondominiumPreparingPage activeCondo={activeCondo} setActiveCondo={setActiveCondo} />;
}

function CondominiumPreparingPage({ activeCondo, setActiveCondo }: { activeCondo: Condominium; setActiveCondo: (condo: Condominium) => void }) {
  return (
    <div className="content-stack">
      <div className="page-tabs" aria-label="Subabas de empreendimentos">
        {condominiumTabs.map((condo) => <button key={condo} className={activeCondo === condo ? "active" : ""} onClick={() => setActiveCondo(condo)}>{condo}</button>)}
      </div>
      <section className="property-header">
        <div>
          <p className="section-kicker">Empreendimento selecionado</p>
          <h2>{activeCondo}</h2>
          <div className="property-location"><MapPin size={15} /> {activeCondo === "Orygem" ? "Avenida Candido Portinari, 170 · Barra da Tijuca · Rio de Janeiro/RJ" : activeCondo === "Concept" ? "Avenida Rosauro Estellita, 35 · Barra da Tijuca · Rio de Janeiro/RJ" : "Avenida Cândido Portinari, 60 · Barra da Tijuca · Rio de Janeiro/RJ"}</div>
        </div>
      </section>
      <section className="metrics-grid">
        <Metric icon={Building2} label="Total de unidades" value={activeCondo === "Orygem" ? "192" : activeCondo === "Concept" ? "77" : "144"} helper={activeCondo === "Orygem" ? "Bloco 1 – 60 · Bloco 2 – 36 · Bloco 3 – 60 · Bloco 4 – 36" : activeCondo === "Concept" ? "Bloco 1 – 43 · Bloco 2 – 34" : "Bloco 1 – 80 · Bloco 2 – 64"} badges={activeCondo === "Orygem" ? ["Blocos 1 e 3 · 11 andares", "Blocos 2 e 4 · 10 andares"] : activeCondo === "Concept" ? ["9 andares"] : ["9 andares"]} />
        <Metric icon={Ruler} label="Área total do condomínio" value={activeCondo === "Orygem" ? "17.000 m²" : activeCondo === "Concept" || activeCondo === "Mudrá" ? "8.573 m²" : "A informar"} helper="" />
        <Metric icon={Gauge} label="Taxa de ocupação" value="A informar" helper="" />
        <Metric icon={CalendarDays} label="Entrega e idade" value={activeCondo === "Orygem" ? "06/2024" : activeCondo === "Concept" ? "05/2025" : "06/2023"} helper={activeCondo === "Orygem" ? elapsedAgeFrom(5, 2024) : activeCondo === "Concept" ? elapsedAgeFrom(4, 2025) : elapsedAgeFrom(5, 2023)} />
      </section>
      {activeCondo === "Orygem" ? <AverageAreaValues ranges={orygemAreaRanges.map((range) => range.label)} values={orygemAverageValues} transactionCounts={orygemTransactionCounts} metadata={orygemAreaMetadata} /> : activeCondo === "Concept" ? <AverageAreaValues ranges={conceptAreaRanges.map((range) => range.label)} values={conceptAverageValues} transactionCounts={conceptTransactionCounts} metadata={conceptAreaMetadata} /> : <AverageAreaValues ranges={mudraAreaRanges.map((range) => range.label)} values={mudraAverageValues} transactionCounts={mudraTransactionCounts} metadata={mudraAreaMetadata} />}
      {activeCondo === "Orygem" ? <SalesHistory condo="Orygem" sales={orygemSales} /> : activeCondo === "Concept" ? <SalesHistory condo="Concept" sales={conceptSales} /> : <SalesHistory condo="Mudrá" sales={mudraSales} />}
    </div>
  );
}

function PendingAverageAreaValues({ ranges = ["Faixa 01", "Faixa 02", "Faixa 03", "Faixa 04"] }: { ranges?: string[] }) {
  return (
    <section className="surface-card average-area-card">
      <div className="section-heading"><div><p className="section-kicker">Referência de valores</p><h2>Valor médio por metragem</h2></div><Ruler size={21} /></div>
      <p className="section-description">As faixas de metragem e os valores médios serão preenchidos com os dados oficiais deste empreendimento.</p>
      <div className="area-values-grid">
        {ranges.map((range) => <div className="area-value-item" key={range}><span>{range}</span><strong>A informar</strong><small>valor médio da faixa</small></div>)}
      </div>
    </section>
  );
}

function PendingSalesHistory({ condo }: { condo: Condominium }) {
  return (
    <section className="surface-card sales-card">
      <div className="section-heading section-heading-wrap"><div><p className="section-kicker">Histórico de vendas</p><h2>Vendas desde janeiro de 2025</h2><p className="section-description">O histórico do {condo} será organizado com unidade, bloco, data, valor, área, preço/m², posição e orientação solar.</p></div><div className="table-actions"><label className="search-box"><Search size={16} /><input placeholder="Buscar unidade ou bloco" disabled /></label><button className="filter-button" disabled><SlidersHorizontal size={16} /> Filtros</button></div></div>
      <div className="empty-filter"><FileText size={17} /> Registros de vendas desde janeiro de 2025 serão adicionados nesta subaba.</div>
      <div className="table-footer"><span>Aguardando dados oficiais</span><span className="client-note"><ShieldCheck size={14} /> Consulta transparente para moradores, parceiros e administradoras</span></div>
    </section>
  );
}

function SalesHistory({ condo, sales }: { condo: "Concept" | "Mudrá" | "Orygem"; sales: SaleRow[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SaleSortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const filteredSales = sales.filter((sale) => `${sale.unit} ${sale.complement}`.toLowerCase().includes(searchTerm.toLowerCase()));
  const sortedSales = [...filteredSales].sort((first, second) => {
    const firstValue = saleSortValue(first, sortKey ?? "date");
    const secondValue = saleSortValue(second, sortKey ?? "date");
    const direction = sortKey ? sortDirection : "desc";
    return direction === "asc" ? firstValue - secondValue : secondValue - firstValue;
  });
  const toggleSort = (key: SaleSortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc");
      return;
    }
    setSortKey(key);
    setSortDirection("asc");
  };
  return (
    <section className="surface-card sales-card">
      <div className="section-heading section-heading-wrap"><div><p className="section-kicker">Histórico de vendas</p><h2>Vendas desde janeiro de 2025</h2><p className="section-description">Histórico do {condo} com unidade, bloco, data, valor, área, preço/m², posição e orientação solar. Os {sales.length} registros aparecem individualmente.</p></div><div className="table-actions"><label className="search-box"><Search size={16} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Buscar unidade ou bloco" /></label><button className="filter-button"><SlidersHorizontal size={16} /> Filtros</button></div></div>
      <div className="data-table-wrap"><table className="data-table"><thead><tr><th><SortButton label="Unidade" sortKey="unit" activeKey={sortKey} direction={sortDirection} onClick={toggleSort} /></th><th><SortButton label="Data da venda" sortKey="date" activeKey={sortKey} direction={sortDirection} onClick={toggleSort} /></th><th><SortButton label="Valor" sortKey="value" activeKey={sortKey} direction={sortDirection} onClick={toggleSort} /></th><th><SortButton label="Área" sortKey="area" activeKey={sortKey} direction={sortDirection} onClick={toggleSort} /></th><th><SortButton label="Preço/m²" sortKey="pricePerM2" activeKey={sortKey} direction={sortDirection} onClick={toggleSort} /></th><th><SortButton label="Posição" sortKey="position" activeKey={sortKey} direction={sortDirection} onClick={toggleSort} /></th><th><SortButton label="Orientação solar" sortKey="solarOrientation" activeKey={sortKey} direction={sortDirection} onClick={toggleSort} /></th></tr></thead><tbody>{sortedSales.map((sale, index) => <tr key={`${sale.unit}-${sale.date}-${sale.value}-${index}`}><td><strong>{sale.unit}</strong><span className="cell-subtext">{sale.complement}</span></td><td>{sale.date}</td><td className="money-cell">{sale.value}</td><td>{sale.area}</td><td>{sale.pricePerM2}</td><td>{sale.position}</td><td className="solar-cell">{sale.solarOrientation ?? "A informar"}</td></tr>)}</tbody></table></div>
      {sortedSales.length === 0 && <div className="empty-filter"><Search size={17} /> Nenhuma unidade encontrada para essa busca.</div>}
      <div className="table-footer"><span>Mostrando {sortedSales.length} de {sales.length} registros de referência</span><span className="client-note"><ShieldCheck size={14} /> Consulta transparente para moradores, parceiros e administradoras</span></div>
    </section>
  );
}

function LatitudPage({ activeCondo, setActiveCondo }: { activeCondo: Condominium; setActiveCondo: (condo: Condominium) => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SaleSortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const filteredSales = latitudSales.filter((sale) => `${sale.unit} ${sale.complement}`.toLowerCase().includes(searchTerm.toLowerCase()));
  const sortedSales = [...filteredSales].sort((first, second) => {
    const firstValue = saleSortValue(first, sortKey ?? "date");
    const secondValue = saleSortValue(second, sortKey ?? "date");
    const direction = sortKey ? sortDirection : "desc";
    return direction === "asc" ? firstValue - secondValue : secondValue - firstValue;
  });
  const toggleSort = (key: SaleSortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc");
      return;
    }
    setSortKey(key);
    setSortDirection("asc");
  };
  return (
    <div className="content-stack">
      <div className="page-tabs" aria-label="Subabas de empreendimentos">
        {condominiumTabs.map((condo) => <button key={condo} className={activeCondo === condo ? "active" : ""} onClick={() => setActiveCondo(condo)}>{condo}</button>)}
      </div>
      <section className="property-header">
        <div>
          <p className="section-kicker">Empreendimento selecionado</p>
          <h2>Latitud</h2>
          <div className="property-location"><MapPin size={15} /> Avenida Rosauro Estelita, 155 · Barra da Tijuca · Rio de Janeiro/RJ</div>
        </div>
      </section>
      <section className="metrics-grid">
        <Metric icon={Building2} label="Total de unidades" value="192" helper="Bloco 1 – 60 · Bloco 2 – 36 · Bloco 3 – 60 · Bloco 4 – 36" badges={["Blocos 1 e 3 · 11 andares", "Blocos 2 e 4 · 10 andares"]} />
        <Metric icon={Ruler} label="Área total do condomínio" value="17.000 m²" helper="" />
        <Metric icon={Gauge} label="Taxa de ocupação" value="A informar" helper="" />
        <Metric icon={CalendarDays} label="Entrega e idade" value="04/2023" helper={elapsedAgeFrom(3, 2023)} />
      </section>
      <AverageAreaValues ranges={latitudAreaRanges.map((range) => range.label)} values={latitudAverageValues} transactionCounts={latitudTransactionCounts} metadata={latitudAreaMetadata} />
      <section className="surface-card sales-card">
        <div className="section-heading section-heading-wrap"><div><p className="section-kicker">Histórico de vendas</p><h2>Vendas desde janeiro de 2025</h2><p className="section-description">Histórico do Latitud com unidade, bloco, data, valor, área, preço/m², posição e orientação solar. A partir de janeiro de 2025, cada transação aparece individualmente.</p></div><div className="table-actions"><label className="search-box"><Search size={16} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Buscar unidade ou bloco" /></label><button className="filter-button"><SlidersHorizontal size={16} /> Filtros</button></div></div>
        <div className="data-table-wrap"><table className="data-table"><thead><tr><th><SortButton label="Unidade" sortKey="unit" activeKey={sortKey} direction={sortDirection} onClick={toggleSort} /></th><th><SortButton label="Data da venda" sortKey="date" activeKey={sortKey} direction={sortDirection} onClick={toggleSort} /></th><th><SortButton label="Valor" sortKey="value" activeKey={sortKey} direction={sortDirection} onClick={toggleSort} /></th><th><SortButton label="Área" sortKey="area" activeKey={sortKey} direction={sortDirection} onClick={toggleSort} /></th><th><SortButton label="Preço/m²" sortKey="pricePerM2" activeKey={sortKey} direction={sortDirection} onClick={toggleSort} /></th><th><SortButton label="Posição" sortKey="position" activeKey={sortKey} direction={sortDirection} onClick={toggleSort} /></th><th><SortButton label="Orientação solar" sortKey="solarOrientation" activeKey={sortKey} direction={sortDirection} onClick={toggleSort} /></th></tr></thead><tbody>{sortedSales.map((sale, index) => <tr key={`${sale.unit}-${sale.date}-${sale.value}-${index}`}><td><strong>{sale.unit}</strong><span className="cell-subtext">{sale.complement}</span></td><td>{sale.date}</td><td className="money-cell">{sale.value}</td><td>{sale.area}</td><td>{sale.pricePerM2}</td><td>{sale.position}</td><td className="solar-cell">{sale.solarOrientation ?? "A informar"}</td></tr>)}</tbody></table></div>
        {sortedSales.length === 0 && <div className="empty-filter"><Search size={17} /> Nenhuma unidade encontrada para essa busca.</div>}
        <div className="table-footer"><span>Mostrando {sortedSales.length} registros de referência</span><span className="client-note"><ShieldCheck size={14} /> Consulta transparente para moradores, parceiros e administradoras</span></div>
      </section>
    </div>
  );
}

const listingCondoNames = ["Concept", "Latitud", "Mudrá", "Orygem"] as const;
type ListingCondoName = (typeof listingCondoNames)[number];
const privateListingLinks: Partial<Record<ListingCondoName, string>> = {
  "Mudrá": "https://bluedoorimoveis.com.br/comprar/imoveis?condos%5B0%5D=eba851d0-5615-4134-ae5a-73791835899c&sort=-updated_at%2Cid&offset=1&limit=21&typeArea=total_area&floorComparision=equals",
  "Latitud": "https://bluedoorimoveis.com.br/comprar/imoveis?condos%5B0%5D=3415e599-ba3c-4c09-87f8-ecae38fbc807&sort=-updated_at%2Cid&offset=1&limit=21&typeArea=total_area&floorComparision=equals",
  "Orygem": "https://bluedoorimoveis.com.br/comprar/imoveis?condos%5B0%5D=d0be86a7-4f81-4fca-91af-f597602fb6a6&sort=-updated_at%2Cid&offset=1&limit=21&typeArea=total_area&floorComparision=equals",
};
const developerListingLinks: Partial<Record<ListingCondoName, string>> = {
  "Latitud": "https://bluedoorlancamentos.com.br/comprar/imoveis/rio-de-janeiro-rj?condos%5B0%5D=3c7a79db-cc5a-4c79-9eda-9f01527677e5&sort=-created_at%2Cid&offset=1&limit=21&typeArea=total_area&floorComparision=equals",
  "Orygem": "https://bluedoorlancamentos.com.br/comprar/imoveis/rio-de-janeiro-rj?condos%5B0%5D=a79bae05-a74c-4f2b-a4a0-5ba5a70e1d67&sort=-created_at%2Cid&offset=1&limit=21&typeArea=total_area&floorComparision=equals",
  "Concept": "https://bluedoorlancamentos.com.br/comprar/imoveis/rio-de-janeiro-rj?condos%5B0%5D=b40e5888-cf4c-4ebb-91ff-fd58d6c15687&sort=-created_at%2Cid&offset=1&limit=21&typeArea=total_area&floorComparision=equals",
};

function ListingCondoButtons({ includeConcept = true, exclude = [], links = {} }: { includeConcept?: boolean; exclude?: ListingCondoName[]; links?: Partial<Record<ListingCondoName, string>> }) {
  const condoNames = (includeConcept ? listingCondoNames : listingCondoNames.filter((condo) => condo !== "Concept")).filter((condo) => !exclude.includes(condo));
  return <div className="listing-links-grid" aria-label="Links por condomínio">{condoNames.map((condo) => links[condo] ? <a key={condo} className="primary-button listing-condo-button" href={links[condo]} target="_blank" rel="noreferrer"><ExternalLink size={15} /> {condo}</a> : <button key={condo} type="button" className="primary-button listing-condo-button" disabled title={`Link de ${condo} será adicionado`}><ExternalLink size={15} /> {condo}</button>)}</div>;
}

function ActiveListingsPage() {
  return (
    <div className="content-stack">
      <section className="intro-banner listings-intro"><div className="intro-icon"><Home size={25} /></div><div><p className="section-kicker">Links das unidades</p><h2>Anúncios ativos</h2><p>Encontre os links públicos organizados por origem: unidades particulares e imóveis do permutante ou da construtora.</p></div></section>
      <div className="listing-divisions">
        <article className="surface-card listing-division-card">
          <div className="listing-card-image"><img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663932519065/ZbxpVmBQlfCWnGnY.png" alt="Imóveis de unidades particulares" /></div>
          <div className="listing-card-body">
            <h2>Unidades particulares</h2>
            <p>Confira as oportunidades de imóveis particulares disponíveis no catálogo da Bluedoor Imóveis.</p>
            <ListingCondoButtons includeConcept={false} links={privateListingLinks} />
          </div>
        </article>
        <article className="surface-card listing-division-card">
          <div className="listing-card-image"><img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663932519065/iobyUzlQKRftYHCw.png" alt="Imóveis do permutante e da construtora" /></div>
          <div className="listing-card-body">
            <h2>Unidades Permutante / Construtora</h2>
            <p>Confira os imóveis disponíveis para compra no catálogo público de lançamentos da Bluedoor.</p>
            <ListingCondoButtons exclude={["Mudrá"]} links={developerListingLinks} />
          </div>
        </article>
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="content-stack">
      <section className="intro-banner contact-intro"><div className="intro-icon"><Handshake size={25} /></div><div><p className="section-kicker">Canal direto</p><h2>Divulgue com a gente</h2><p>Apresente sua oportunidade à equipe da Bluedoor e aumente a visibilidade do seu imóvel para corretores e moradores que consultam a plataforma.</p></div></section>
      <section className="surface-card contact-card"><div className="contact-card-icon"><MessageCircle size={27} /></div><div><p className="section-kicker">Sua oportunidade em destaque</p><h2>Divulgue seu imóvel</h2><p className="contact-placeholder">Tem uma unidade ou oportunidade para anunciar? Fale com a nossa equipe para entender como apresentar seu imóvel a quem já busca informações e novas possibilidades na plataforma.</p><div className="contact-actions"><a className="primary-button" href="https://wa.me/5521974050590" target="_blank" rel="noreferrer"><WhatsAppIcon size={16} /> Falar pelo WhatsApp</a><a className="primary-button" href="tel:+5521974050590"><Phone size={16} /> Ligar para a equipe</a><a className="outline-button" href="https://bluedoorimoveis.com.br/" target="_blank" rel="noreferrer"><DoorOpen size={16} /> Site de particulares</a><a className="outline-button launch-link" href="https://bluedoorlancamentos.com.br/" target="_blank" rel="noreferrer"><span className="door-launch-icon"><DoorOpen size={16} /><Sparkles size={9} /></span> Site de lançamentos</a></div></div></section>
      <div className="audience-grid contact-audience-grid"><div className="audience-card audience-brand-card"><img className="audience-brand-logo" src={LOGO_URL} alt="Bluedoor Imóveis" /><p className="section-kicker">Bluedoor Imóveis</p><h3>Conte com a nossa equipe</h3><p>Informação clara para moradores, parceiros e administradoras.</p></div><AudienceCard icon={Users} title="Moradores" text="Tire dúvidas sobre as informações do seu empreendimento." /><AudienceCard icon={Handshake} title="Parceiros" text="Fale com a equipe sobre uma unidade ou oportunidade." /><AudienceCard icon={Landmark} title="Administradoras" text="Solicite alinhamentos ou atualizações de dados." /></div>
    </div>
  );
}

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.893c0 2.096.547 4.142 1.588 5.946L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.479-8.413z" /></svg>;
}

function AudienceCard({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return <article className="surface-card audience-card"><div className="audience-icon"><Icon size={21} /></div><h3>{title}</h3><p>{text}</p></article>;
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return <div className="step"><span className="step-number">{number}</span><div><strong>{title}</strong><p>{text}</p></div></div>;
}

function FeatureItem({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return <div className="feature-item"><div className="feature-icon"><Icon size={20} /></div><div><strong>{title}</strong><p>{text}</p></div></div>;
}

function Metric({ icon: Icon, label, value, helper, badges = [] }: { icon: LucideIcon; label: string; value: string; helper: string; badges?: string[] }) {
  return <article className={`surface-card metric-card ${badges.length > 0 ? "has-metric-badges" : ""}`}><div className="metric-icon"><Icon size={19} /></div><div><p>{label}</p><strong>{value}</strong>{helper && <span>{helper}</span>}{badges.length > 0 && <div className="metric-badges">{badges.map((badge) => <span className="metric-badge" key={badge}>{badge}</span>)}</div>}</div></article>;
}

function saleSortValue(sale: SaleRow, key: SaleSortKey) {
  if (key === "unit") {
    const match = sale.unit.match(/Blc\s*(\d+)\s+Apt\s*(\d+)/i);
    return match ? Number(match[1]) * 1_000_000 + Number(match[2]) : Number.POSITIVE_INFINITY;
  }
  if (key === "position") return sale.position === "Frente" ? 1 : sale.position === "Fundos" ? 2 : 99;
  if (key === "solarOrientation") return sale.solarOrientation === "Nascente" ? 1 : sale.solarOrientation === "Poente" ? 2 : 99;
  if (key === "date") {
    const [day, month, year] = sale.date.split("/").map(Number);
    return new Date(year, month - 1, day).getTime();
  }
  if (key === "area") return Number.parseFloat(sale.area.replace(" m²", "").replace(",", "."));
  return Number.parseFloat(sale[key].replace(/R\$\s?/g, "").replace(/\./g, "").replace(",", "."));
}

function SortButton({ label, sortKey, activeKey, direction, onClick }: { label: string; sortKey: SaleSortKey; activeKey: SaleSortKey | null; direction: SortDirection; onClick: (key: SaleSortKey) => void }) {
  const isActive = activeKey === sortKey;
  const Icon = isActive ? (direction === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return <button className={`sort-button ${isActive ? "active" : ""}`} onClick={() => onClick(sortKey)} aria-label={`Ordenar ${label} em ordem ${isActive && direction === "desc" ? "crescente" : "decrescente"}`}><span>{label}</span><Icon size={13} /></button>;
}

const coverageAreaLabels = new Set(["199 m²", "372 m²", "413 m²"]);

function AverageAreaValues({ values, ranges: customRanges, transactionCounts: customTransactionCounts, metadata }: { values?: Record<string, string>; ranges?: string[]; transactionCounts?: Record<string, number>; metadata?: Record<string, { category: string; detail: string }> }) {
  const ranges = customRanges ?? ["120–125 m²", "153–156 m²", "179–187 m²", "372 m²"];
  const transactionCounts: Record<string, number> = customTransactionCounts ?? { "120–125 m²": 32, "153–156 m²": 9, "179–187 m²": 3, "372 m²": 2 };
  return (
    <section className="surface-card average-area-card">
      <div className="section-heading"><div><p className="section-kicker">Referência de valores</p><h2>Valor médio por metragem</h2></div><Ruler size={21} /></div>
      <div className="area-values-grid">
        {ranges.map((range) => <div className="area-value-item" key={range}><div className="area-value-heading"><span>{range}</span><em>{metadata?.[range]?.category ?? (coverageAreaLabels.has(range) ? "Cobertura" : "Apartamento")}</em></div>{metadata?.[range]?.detail && <p className="area-value-detail">{metadata[range].detail}</p>}<strong>{values?.[range] ?? "A informar"}</strong><small>{values?.[range] === "Sem dados recentes" ? "nenhuma transação recente" : values?.[range] && values[range] !== "A informar" ? `média de ${transactionCounts[range]} transações` : "valor médio da faixa"}</small></div>)}
      </div>
    </section>
  );
}

function DetailRow({ icon: Icon, label, value, note }: { icon: LucideIcon; label: string; value: string; note?: string }) {
  return <div className="detail-row"><Icon size={17} /><div><span>{label}</span><strong>{value}</strong>{note && <small>{note}</small>}</div></div>;
}

function App() {
  return (
    <Router hook={useHashLocation}>
      <DashboardApp />
    </Router>
  );
}

export default App;
