import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";

import SecurityIcon from "@mui/icons-material/Security";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HistoryIcon from "@mui/icons-material/History";
import ShieldIcon from "@mui/icons-material/Shield";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// --------------------------------------------------
// BANKSHIELD THEME: MIDNIGHT NAVY + TEAL
// --------------------------------------------------

const bankShieldTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#172554",
      dark: "#101828",
      light: "#334b7a",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0f9f93",
      dark: "#0b8178",
      light: "#5eead4",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f4f7fb",
      paper: "#ffffff",
    },
    text: {
      primary: "#172033",
      secondary: "#64748b",
    },
    success: { main: "#15803d" },
    warning: { main: "#b45309" },
    error: { main: "#b91c1c" },
    info: { main: "#0f9f93" },
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 750,
      letterSpacing: "-0.025em",
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h6: {
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    button: {
      textTransform: "none",
      fontWeight: 650,
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#f4f7fb",
        },
        "::selection": {
          backgroundColor: "#99f6e4",
          color: "#101828",
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "0 4px 18px rgba(16, 24, 40, 0.12)",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #e5eaf1",
          boxShadow: "0 5px 18px rgba(16, 24, 40, 0.045)",
          backgroundImage: "none",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9,
          paddingInline: 16,
        },
        containedPrimary: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
            backgroundColor: "#101828",
          },
        },
        containedSecondary: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
            backgroundColor: "#0b8178",
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "#edf2f7",
          color: "#172554",
          fontWeight: 700,
          whiteSpace: "nowrap",
          borderBottom: "1px solid #dce5ef",
        },
        root: {
          borderColor: "#e5eaf1",
          paddingTop: 13,
          paddingBottom: 13,
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": {
            borderBottom: 0,
          },
          "&:hover": {
            backgroundColor: "#f0fdfa",
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#0f9f93",
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "#0b8178",
          },
        },
      },
    },
  },
});

// --------------------------------------------------
// API CONFIGURATION
// --------------------------------------------------

const API_URL = "http://127.0.0.1:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// --------------------------------------------------
// REUSABLE DASHBOARD SUMMARY CARD
// --------------------------------------------------

function SummaryCard({ title, value, icon, color }) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 10px 24px rgba(16, 24, 40, 0.09)",
        },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography color="text.secondary" variant="body2">
            {title}
          </Typography>

          <Box
            sx={{
              color,
              bgcolor: `${color}14`,
              borderRadius: 2,
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Box>

        <Typography variant="h4" fontWeight="bold" mt={2}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

// --------------------------------------------------
// LOGIN PAGE
// --------------------------------------------------

function LoginPage({
  onLogin,
  onSwitchToRegister,
  registrationMessage,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        username: username.trim(),
        password,
      });

      onLogin(response.data.access_token, response.data.user);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to sign in. Check the Flask server and your credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
        background:
          "radial-gradient(circle at top left, #e0f2f1 0%, #f4f7fb 42%, #eef2ff 100%)",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 450,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <Box sx={{ height: 5, bgcolor: "secondary.main" }} />

        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box textAlign="center" mb={3}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#e0f2f1",
                color: "secondary.dark",
                borderRadius: 3,
                p: 1.5,
              }}
            >
              <SecurityIcon sx={{ fontSize: 42 }} />
            </Box>

            <Typography variant="h3" fontWeight="bold" mt={1}>
              BankShield
            </Typography>

            <Typography color="text.secondary" mt={1}>
              Secure Banking Operations
            </Typography>
          </Box>

          <Typography variant="h5" fontWeight="bold" mb={2}>
            Sign in to your account
          </Typography>

          {registrationMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {registrationMessage}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              required
              label="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              margin="normal"
              autoComplete="username"
            />

            <TextField
              fullWidth
              required
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              margin="normal"
              autoComplete="current-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={() =>
                          setShowPassword((value) => !value)
                        }
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              disabled={loading}
              sx={{ mt: 3, py: 1.4 }}
            >
              {loading ? "Signing in..." : "SIGN IN"}
            </Button>
          </Box>

          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Button
                size="small"
                onClick={onSwitchToRegister}
                color="secondary"
              >
                Create account
              </Button>
            </Typography>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            textAlign="center"
            mt={2}
          >
            Your account is managed by the BankShield backend.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

// --------------------------------------------------
// CREATE ACCOUNT PAGE
// --------------------------------------------------

function RegisterPage({ onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanUsername = username.trim();

    if (cleanUsername.length < 3 || cleanUsername.length > 40) {
      setError("Username must contain between 3 and 40 characters.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        username: cleanUsername,
        password,
      });

      setSuccess("Account created successfully. Please sign in.");

      setTimeout(() => {
        onSwitchToLogin("Account created successfully. Please sign in.");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to create account. Check the Flask server."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
        background:
          "radial-gradient(circle at top left, #e0f2f1 0%, #f4f7fb 42%, #eef2ff 100%)",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 450,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <Box sx={{ height: 5, bgcolor: "secondary.main" }} />

        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box textAlign="center" mb={3}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#e0f2f1",
                color: "secondary.dark",
                borderRadius: 3,
                p: 1.5,
              }}
            >
              <SecurityIcon sx={{ fontSize: 42 }} />
            </Box>

            <Typography variant="h3" fontWeight="bold" mt={1}>
              BankShield
            </Typography>

            <Typography color="text.secondary" mt={1}>
              Secure Banking Operations
            </Typography>
          </Box>

          <Typography variant="h5" fontWeight="bold" mb={2}>
            Create your account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              required
              label="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              margin="normal"
              autoComplete="username"
              inputProps={{ minLength: 3, maxLength: 40 }}
            />

            <TextField
              fullWidth
              required
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              margin="normal"
              autoComplete="new-password"
              helperText="Use at least 8 characters."
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={() =>
                          setShowPassword((value) => !value)
                        }
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              fullWidth
              required
              label="Confirm password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              margin="normal"
              autoComplete="new-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              disabled={loading}
              sx={{ mt: 3, py: 1.4 }}
            >
              {loading ? "Creating account..." : "CREATE ACCOUNT"}
            </Button>
          </Box>

          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Button
                size="small"
                onClick={() => onSwitchToLogin("")}
                color="secondary"
              >
                Sign in
              </Button>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

// --------------------------------------------------
// DASHBOARD
// --------------------------------------------------

function Dashboard({ user, onLogout }) {
  const [transactions, setTransactions] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewingId, setReviewingId] = useState("");

  const isAdmin = user.role === "Admin";

  const loadData = useCallback(async () => {
    try {
      setError("");

      const [transactionResponse, auditResponse] = await Promise.all([
        api.get("/transactions"),
        api.get("/audit-logs"),
      ]);

      setTransactions(transactionResponse.data.transactions || []);
      setAuditLogs(auditResponse.data.audit_logs || []);
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout();
        return;
      }

      console.error("Failed to load BankShield data:", err);

      setError(
        "Could not load data. Check that Flask and MongoDB are running."
      );
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function reviewTransaction(id) {
    try {
      setReviewingId(id);
      setError("");

      await api.put(`/transactions/${id}/review`);

      await loadData();
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout();
        return;
      }

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Could not update the transaction. Please try again."
      );
    } finally {
      setReviewingId("");
    }
  }

  const flaggedCount = transactions.filter(
    (transaction) => transaction.status === "Flagged"
  ).length;

  const reviewedCount = transactions.filter(
    (transaction) => transaction.status === "Reviewed"
  ).length;

  const highRiskCount = transactions.filter(
    (transaction) => transaction.risk_level === "High"
  ).length;

  const filteredTransactions = transactions.filter((transaction) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      String(transaction.id ?? "").toLowerCase().includes(query) ||
      String(transaction.account ?? "").toLowerCase().includes(query) ||
      String(transaction.reason ?? "").toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All" ||
      transaction.status === statusFilter;

    const matchesRisk =
      riskFilter === "All" ||
      transaction.risk_level === riskFilter;

    return matchesSearch && matchesStatus && matchesRisk;
  });

  const riskColors = {
    High: "error",
    Medium: "warning",
    Low: "success",
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ gap: 1, flexWrap: "wrap" }}>
          <SecurityIcon sx={{ mr: 1, color: "secondary.light" }} />

          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ flexGrow: 1 }}
          >
            BankShield
          </Typography>

          <Chip
            label={`${user.username} · ${user.role}`}
            color="info"
            variant="outlined"
            sx={{
              color: "#ffffff",
              borderColor: "rgba(255,255,255,0.45)",
              "& .MuiChip-label": { fontWeight: 600 },
            }}
          />

          <Button color="inherit" onClick={onLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: { xs: 2.5, sm: 4 } }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ fontSize: { xs: "1.7rem", sm: "2.125rem" } }}
        >
          Banking Operations Dashboard
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Monitor transactions, assess rule-based risk, and review
          security alerts stored in MongoDB.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}

            <Button size="small" onClick={loadData} sx={{ ml: 1 }}>
              Retry
            </Button>
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <>
            {/* DASHBOARD SUMMARY CARDS */}

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard
                  title="Total Transactions"
                  value={transactions.length}
                  icon={<AccountBalanceIcon />}
                  color="#0f9f93"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard
                  title="Flagged Transactions"
                  value={flaggedCount}
                  icon={<WarningAmberIcon />}
                  color="#b45309"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard
                  title="Reviewed Transactions"
                  value={reviewedCount}
                  icon={<CheckCircleIcon />}
                  color="#15803d"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard
                  title="High-Risk Transactions"
                  value={highRiskCount}
                  icon={<ShieldIcon />}
                  color="#b91c1c"
                />
              </Grid>
            </Grid>

            {/* TRANSACTION MONITORING */}

            <Card sx={{ borderRadius: 3, mb: 4 }}>
              <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <ShieldIcon color="secondary" />

                  <Typography variant="h6" fontWeight="bold">
                    Transaction Monitoring & Risk Assessment
                  </Typography>
                </Box>

                <Box
                  display="flex"
                  gap={2}
                  flexWrap="wrap"
                  sx={{ mb: 3 }}
                >
                  <TextField
                    label="Search transactions"
                    size="small"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    sx={{ flex: "1 1 220px" }}
                  />

                  <TextField
                    select
                    label="Filter by status"
                    size="small"
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                    sx={{ minWidth: 165 }}
                  >
                    <MenuItem value="All">All statuses</MenuItem>
                    <MenuItem value="Flagged">Flagged</MenuItem>
                    <MenuItem value="Reviewed">Reviewed</MenuItem>
                  </TextField>

                  <TextField
                    select
                    label="Filter by risk"
                    size="small"
                    value={riskFilter}
                    onChange={(event) =>
                      setRiskFilter(event.target.value)
                    }
                    sx={{ minWidth: 165 }}
                  >
                    <MenuItem value="All">All risk levels</MenuItem>
                    <MenuItem value="High">High risk</MenuItem>
                    <MenuItem value="Medium">Medium risk</MenuItem>
                    <MenuItem value="Low">Low risk</MenuItem>
                  </TextField>

                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("All");
                      setRiskFilter("All");
                    }}
                  >
                    Reset
                  </Button>
                </Box>

                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                >
                  <Table sx={{ minWidth: 1050 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Transaction ID</TableCell>
                        <TableCell>Account</TableCell>
                        <TableCell>Amount (INR)</TableCell>
                        <TableCell>Risk Score</TableCell>
                        <TableCell>Risk Level</TableCell>
                        <TableCell>Review Status</TableCell>
                        <TableCell>Risk Reasons</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction) => {
                          const transactionId = String(
                            transaction.id ?? transaction._id ?? ""
                          );
                          const amount = Number(transaction.amount ?? 0);
                          const riskLevel =
                            transaction.risk_level ?? "Unknown";
                          const status = transaction.status ?? "Unknown";

                          return (
                            <TableRow
                              key={transactionId}
                              hover
                            >
                              <TableCell>{transactionId || "—"}</TableCell>

                              <TableCell>
                                {transaction.account ?? "—"}
                              </TableCell>

                              <TableCell>
                                ₹{amount.toLocaleString("en-IN")}
                              </TableCell>

                              <TableCell>
                                {transaction.risk_score ?? "—"}
                              </TableCell>

                              <TableCell>
                                <Chip
                                  size="small"
                                  label={`${riskLevel} Risk`}
                                  color={riskColors[riskLevel] || "default"}
                                />
                              </TableCell>

                              <TableCell>
                                <Chip
                                  size="small"
                                  label={status}
                                  color={
                                    status === "Flagged"
                                      ? "warning"
                                      : status === "Reviewed"
                                        ? "success"
                                        : "default"
                                  }
                                />
                              </TableCell>

                              <TableCell>
                                {(transaction.risk_reasons || []).join(", ") ||
                                  "—"}
                              </TableCell>

                              <TableCell>
                                {status === "Flagged" && isAdmin ? (
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="secondary"
                                    disabled={reviewingId === transactionId}
                                    onClick={() =>
                                      reviewTransaction(transactionId)
                                    }
                                  >
                                    {reviewingId === transactionId
                                      ? "Saving..."
                                      : "Mark Reviewed"}
                                  </Button>
                                ) : (
                                  <Typography variant="body2" color="text.secondary">
                                    {status === "Reviewed"
                                      ? "Reviewed"
                                      : "Admin access required"}
                                  </Typography>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} align="center">
                            No matching transactions found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{ mt: 2 }}
                >
                  Demonstration data only. Risk scores use amount-based
                  rules and are not confirmed fraud predictions.
                </Typography>
              </CardContent>
            </Card>

            {/* AUDIT HISTORY */}

            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  mb={1}
                  flexWrap="wrap"
                >
                  <HistoryIcon color="primary" />

                  <Typography variant="h6" fontWeight="bold">
                    Audit History
                  </Typography>

                  <Chip
                    label={`${auditLogs.length} events`}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                </Box>

                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Recorded transaction and authentication events retrieved
                  from MongoDB.
                </Typography>

                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                >
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Transaction ID</TableCell>
                        <TableCell>Action</TableCell>
                        <TableCell>Previous Status</TableCell>
                        <TableCell>New Status</TableCell>
                        <TableCell>Date &amp; Time (UTC)</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {auditLogs.length > 0 ? (
                        auditLogs.map((log, index) => {
                          const transactionId =
                            log.transaction_id ??
                            log.transactionId ??
                            "";

                          const action = log.action ?? "Unknown";

                          const previousStatus =
                            log.previous_status ??
                            log.previousStatus ??
                            "";

                          const newStatus =
                            log.new_status ??
                            log.newStatus ??
                            "";

                          const timestamp = log.timestamp;

                          return (
                            <TableRow
                              key={`${transactionId}-${timestamp ?? index}-${index}`}
                              hover
                            >
                              <TableCell>
                                {transactionId || "—"}
                              </TableCell>

                              <TableCell>
                                <Chip
                                  size="small"
                                  label={action}
                                  variant="outlined"
                                  color={
                                    String(action).toUpperCase() === "LOGIN" ||
                                    String(action).toUpperCase() === "REGISTER"
                                      ? "info"
                                      : "primary"
                                  }
                                  sx={
                                    String(action).toUpperCase() === "LOGIN" ||
                                    String(action).toUpperCase() === "REGISTER"
                                      ? {
                                          borderColor: "#0f9f93",
                                          color: "#0b8178",
                                          fontWeight: 600,
                                        }
                                      : { fontWeight: 600 }
                                  }
                                />
                              </TableCell>

                              <TableCell>
                                {previousStatus || "—"}
                              </TableCell>

                              <TableCell>
                                {newStatus ? (
                                  <Chip
                                    size="small"
                                    label={newStatus}
                                    color={
                                      String(newStatus).toLowerCase() ===
                                      "flagged"
                                        ? "warning"
                                        : String(newStatus).toLowerCase() ===
                                            "reviewed"
                                          ? "success"
                                          : "default"
                                    }
                                  />
                                ) : (
                                  "—"
                                )}
                              </TableCell>

                              <TableCell>
                                {timestamp
                                  ? new Date(timestamp).toLocaleString(
                                      "en-GB",
                                      {
                                        timeZone: "UTC",
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: false,
                                      }
                                    )
                                  : "N/A"}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            No audit events yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </>
        )}
      </Container>
    </Box>
  );
}

// --------------------------------------------------
// MAIN APPLICATION
// --------------------------------------------------

function BankShieldContent() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login");
  const [registrationMessage, setRegistrationMessage] = useState("");

  const logout = useCallback(() => {
    setToken("");
    setUser(null);
    delete api.defaults.headers.common.Authorization;
    setPage("login");
  }, []);

  const login = useCallback((accessToken, currentUser) => {
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    setToken(accessToken);
    setUser(currentUser);
    setRegistrationMessage("");
  }, []);

  if (!token || !user) {
    if (page === "register") {
      return (
        <RegisterPage
          onSwitchToLogin={(message = "") => {
            setRegistrationMessage(message);
            setPage("login");
          }}
        />
      );
    }

    return (
      <LoginPage
        onLogin={login}
        registrationMessage={registrationMessage}
        onSwitchToRegister={() => {
          setRegistrationMessage("");
          setPage("register");
        }}
      />
    );
  }

  return <Dashboard user={user} onLogout={logout} />;
}

// --------------------------------------------------
// THEMED ROOT
// --------------------------------------------------

export default function BankShieldApp() {
  return (
    <ThemeProvider theme={bankShieldTheme}>
      <CssBaseline />
      <BankShieldContent />
    </ThemeProvider>
  );
}