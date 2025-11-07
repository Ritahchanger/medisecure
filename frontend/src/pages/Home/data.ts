import {
  Shield,
  Lock,
  Users,
  FileText,
  Zap,
  Heart,
} from "lucide-react";
export const features = [
  {
    icon: Shield,
    title: "Military-Grade Security",
    description:
      "AES-256 encryption and HIPAA compliance ensure patient data remains confidential and secure.",
    color: "blue",
  },
  {
    icon: Lock,
    title: "Role-Based Access Control",
    description:
      "Fine-grained permissions system for doctors, nurses, and administrators with audit trails.",
    color: "green",
  },
  {
    icon: Users,
    title: "Patient Management",
    description:
      "Comprehensive patient records with medical history, treatments, and secure data storage.",
    color: "purple",
  },
  {
    icon: FileText,
    title: "Audit & Compliance",
    description:
      "Complete audit logs and reporting tools for regulatory compliance and security monitoring.",
    color: "orange",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description:
      "Instant synchronization across all devices with offline capability and cloud backup.",
    color: "red",
  },
  {
    icon: Heart,
    title: "Healthcare Focused",
    description:
      "Built specifically for healthcare professionals with medical workflows in mind.",
    color: "pink",
  },
];

export const stats = [
  { number: "10,000+", label: "Patients Secured" },
  { number: "500+", label: "Healthcare Professionals" },
  { number: "99.9%", label: "Uptime Reliability" },
  { number: "24/7", label: "Security Monitoring" },
];

export const testimonials = [
  {
    name: "Dr. Sarah Chen",
    role: "Chief Medical Officer",
    content:
      "MediSecure has transformed how we handle patient data. The security features give us peace of mind while the interface makes our workflow efficient.",
    avatar: "SC",
  },
  {
    name: "Nurse Michael Rodriguez",
    role: "Head Nurse",
    content:
      "The role-based access is perfect for our team. I can focus on patient care without worrying about data security.",
    avatar: "MR",
  },
  {
    name: "Robert Kim",
    role: "Hospital Administrator",
    content:
      "Compliance reporting used to take days. Now with MediSecure, we generate HIPAA reports in minutes.",
    avatar: "RK",
  },
];
