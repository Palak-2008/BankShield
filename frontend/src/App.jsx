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
} from "@mui/material";

import SecurityIcon from "@mui/icons-material/Security";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HistoryIcon from "@mui/icons-material/History";
import ShieldIcon from "@mui/icons-material/Shield";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const API_URL = "http://127.0.0.1:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Reusable dashboard summary card
function SummaryCard({ title, value, icon, color }) {
  return (
    <Card sx={{ height: "100%", borderRadius: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Typography color="text.secondary" variant="body2">
            {title}
          </Typography>
          <Box sx={{ color }}>{icon}</Box>
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
        bgcolor: "#f4f7fb",
        p: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 450, borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <SecurityIcon sx={{ fontSize: 58, color: "#1976d2" }} />

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
        bgcolor: "#f4f7fb",
        p: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 450, borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <SecurityIcon sx={{ fontSize: 58, color: "#1976d2" }} />

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
      transaction.id.toLowerCase().includes(query) ||
      transaction.account.toLowerCase().includes(query) ||
      transaction.reason.toLowerCase().includes(query);

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
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f7fb" }}>
      <AppBar position="static" sx={{ bgcolor: "#102a43" }}>
        <Toolbar sx={{ gap: 1, flexWrap: "wrap" }}>
          <SecurityIcon sx={{ mr: 1 }} />

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
            sx={{ color: "white" }}
          />

          <Button color="inherit" onClick={onLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
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
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard
                  title="Total Transactions"
                  value={transactions.length}
                  icon={<AccountBalanceIcon />}
                  color="#1976d2"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard
                  title="Flagged Transactions"
                  value={flaggedCount}
                  icon={<WarningAmberIcon />}
                  color="#ed6c02"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard
                  title="Reviewed Transactions"
                  value={reviewedCount}
                  icon={<CheckCircleIcon />}
                  color="#2e7d32"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard
                  title="High-Risk Transactions"
                  value={highRiskCount}
                  icon={<ShieldIcon />}
                  color="#d32f2f"
                />
              </Grid>
            </Grid>

            {/* Transaction monitoring */}
            <Card sx={{ borderRadius: 3, mb: 4 }}>
              <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Transaction Monitoring & Risk Assessment
                </Typography>

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
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("All");
                      setRiskFilter("All");
                    }}
                  >
                    Reset
                  </Button>
                </Box>

                <TableContainer component={Paper} variant="outlined">
                  <Table sx={{ minWidth: 1050 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#edf2f7" }}>
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
                        filteredTransactions.map((transaction) => (
                          <TableRow key={transaction.id} hover>
                            <TableCell>{transaction.id}</TableCell>

                            <TableCell>{transaction.account}</TableCell>

                            <TableCell>
                              ₹{transaction.amount.toLocaleString("en-IN")}
                            </TableCell>

                            <TableCell>
                              {transaction.risk_score}
                            </TableCell>

                            <TableCell>
                              <Chip
                                size="small"
                                label={`${transaction.risk_level} Risk`}
                                color={
                                  riskColors[transaction.risk_level] ||
                                  "default"
                                }
                              />
                            </TableCell>

                            <TableCell>
                              <Chip
                                size="small"
                                label={transaction.status}
                                color={
                                  transaction.status === "Flagged"
                                    ? "warning"
                                    : "success"
                                }
                              />
                            </TableCell>

                            <TableCell>
                              {(transaction.risk_reasons || []).join(", ")}
                            </TableCell>

                            <TableCell>
                              {transaction.status === "Flagged" &&
                              isAdmin ? (
                                <Button
                                  size="small"
                                  variant="contained"
                                  disabled={reviewingId === transaction.id}
                                  onClick={() =>
                                    reviewTransaction(transaction.id)
                                  }
                                >
                                  {reviewingId === transaction.id
                                    ? "Saving..."
                                    : "Mark Reviewed"}
                                </Button>
                              ) : (
                                <Typography variant="body2">
                                  {transaction.status === "Reviewed"
                                    ? "Reviewed"
                                    : "Admin access required"}
                                </Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
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

            {/* Audit history */}
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <HistoryIcon color="primary" />

                  <Typography variant="h6" fontWeight="bold">
                    Audit History
                  </Typography>

                  <Chip
                    label={`${auditLogs.length} events`}
                    size="small"
                  />
                </Box>

                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Recorded transaction review actions retrieved from MongoDB.
                </Typography>

                <TableContainer component={Paper} variant="outlined">
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#edf2f7" }}>
                        <TableCell>Transaction ID</TableCell>
                        <TableCell>Action</TableCell>
                        <TableCell>Previous Status</TableCell>
                        <TableCell>New Status</TableCell>
                        <TableCell>Date & Time (UTC)</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {auditLogs.length > 0 ? (
                        auditLogs.map((log, index) => (
                          <TableRow
                            key={`${log.transaction_id}-${log.timestamp}-${index}`}
                          >
                            <TableCell>{log.transaction_id}</TableCell>

                            <TableCell>
                              <Chip
                                size="small"
                                label={log.action}
                                variant="outlined"
                                color="info"
                              />
                            </TableCell>

                            <TableCell>{log.previous_status}</TableCell>

                            <TableCell>
                              <Chip
                                size="small"
                                label={log.new_status}
                                color="success"
                              />
                            </TableCell>

                            <TableCell>
                              {log.timestamp
                                ? new Date(log.timestamp).toLocaleString()
                                : "N/A"}
                            </TableCell>
                          </TableRow>
                        ))
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

function BankShieldApp() {
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

export default BankShieldApp;