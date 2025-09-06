"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Search,
  MessageSquare,
  User,
  Clock,
  Filter,
  MoreVertical,
  Mail,
  CheckCircle2,
  AlertCircle,
  Users,
  TrendingUp,
  RefreshCw,
  Plus,
  ArrowUpRight,
  Inbox,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CiCalendarDate, CiChat1, CiCircleCheck } from "react-icons/ci";
import { HiOutlineUsers } from "react-icons/hi2";

interface Ticket {
  id: string;
  customer_name: string;
  customer_email: string;
  is_active: boolean;
  enquiry: string;
  created_at: string;
  unreadCount?: number;
}

export default function ChatDashboard() {
  const [date, setDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const [userRole, setUserRole] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = localStorage.getItem("user");
        if (response) {
          setUserRole(JSON.parse(response).entity.user_role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  const stats = [
    {
      name: "Total tickets",
      value: tickets.length,
      color: "blue",
      icon: CiChat1,
    },
    {
      name: "Active tickets",
      value: tickets.filter((ticket) => ticket.is_active === true).length,
      icon: HiOutlineUsers,
      color: "emerald",
    },
    {
      name: "Resolved tickets",
      value: tickets.filter((ticket) => ticket.is_active === false).length,
      icon: CiCircleCheck,
      color: "violet",
    },
    {
      name: "Today tickets",
      value: tickets.filter(
        (ticket) =>
          format(ticket.created_at, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      ).length,
      icon: CiCalendarDate,
      color: "orange",
    },
  ];

  const fetchTickets = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      const response = await fetch(`/api/chat/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("Tickets:", data);
      setTickets(data.rooms || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    let filtered = [...tickets];

    if (activeTab === "active") {
      filtered = filtered.filter((ticket) => ticket.is_active === true);
    } else if (activeTab === "closed") {
      filtered = filtered.filter((ticket) => ticket.is_active === false);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ticket) =>
          ticket.customer_name.toLowerCase().includes(query) ||
          ticket.customer_email.toLowerCase().includes(query) ||
          ticket.enquiry.toLowerCase().includes(query)
      );
    }

    setFilteredTickets(filtered);
  }, [searchQuery, activeTab, tickets]);

  const getStatusDisplay = (isActive: boolean) => {
    if (isActive) {
      return (
        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 font-medium">
          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />
          Active
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-slate-50 text-slate-600 font-medium"
        >
          <div className="w-2 h-2 bg-slate-400 rounded-full mr-1.5" />
          Closed
        </Badge>
      );
    }
  };

  const handleOpenChat = (ticketId: string) => {
    router.push(`/chat/${ticketId}`);
  };

  const handleRefresh = () => {
    fetchTickets(true);
  };

  // Calculate stats
  const activeTickets = tickets.filter((t) => t.is_active === true);
  const closedTickets = tickets.filter((t) => t.is_active === false);
  const todayTickets = tickets.filter(
    (t) => new Date(t.created_at).toDateString() === new Date().toDateString()
  );

  if (userRole !== 7 || userRole == null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">
            You are not authorized to view this chat.
          </p>
          <Button onClick={() => router.push("/")}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="container mx-auto p-4 lg:p-8">
          <div className="animate-pulse space-y-8">
            <div className="flex justify-between items-center">
              <div className="space-y-3">
                <div className="h-8 bg-slate-200 rounded-lg w-48"></div>
                <div className="h-4 bg-slate-200 rounded w-64"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-10 bg-slate-200 rounded-lg w-24"></div>
                <div className="h-10 bg-slate-200 rounded-lg w-40"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto p-4 lg:p-8 space-y-8">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Chat Dashboard
            </h1>
            <p className="text-slate-600 text-lg">
              Manage and respond to customer inquiries
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 hover:shadow-md transition-all duration-200"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDate(new Date())}
              className="flex items-center gap-2 hover:shadow-md transition-all duration-200"
            >
              <CalendarIcon className="h-4 w-4" />
              {date ? format(date, "MMM d, yyyy") : "Todays date"}
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card
              key={stat.name}
              className="group relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-blue-700">
                      {stat.name}
                    </p>
                    <p className="text-3xl font-bold text-blue-900">
                      {stat.value}
                    </p>
                  </div>

                  <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    {<stat.icon size={24} color="white" />}
                  </div>
                </div>
                <p className="text-xs text-blue-600 flex items-center mt-2">
                  {stat.name}
                </p>
              </CardContent>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>
          ))}
        </div>

        {/* Enhanced Chat List */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6 border-b bg-gradient-to-r from-slate-50 to-white">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                Chat Conversations
              </CardTitle>
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="search"
                    placeholder="Search conversations..."
                    className="pl-10 bg-white/80 border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 rounded-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    label=""
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 hover:shadow-md transition-all duration-200"
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs
              defaultValue="all"
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="border-b bg-gradient-to-r from-slate-50/50 to-white/50">
                <TabsList className="w-full justify-start h-14 bg-transparent p-1">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-3 font-medium"
                  >
                    All Conversations
                    <Badge variant="secondary" className="ml-2 bg-slate-100">
                      {tickets.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="active"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-3 font-medium"
                  >
                    Active
                    <Badge className="ml-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                      {activeTickets.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="closed"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-3 font-medium"
                  >
                    Closed
                    <Badge variant="outline" className="ml-2 bg-slate-100">
                      {closedTickets.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="p-0 mt-0">
                {filteredTickets.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-6">
                      <MessageSquare className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      No conversations found
                    </h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                      {searchQuery
                        ? "Try adjusting your search terms or filters"
                        : "New conversations will appear here when customers reach out"}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filteredTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="group p-6 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/30 cursor-pointer transition-all duration-300 hover:shadow-sm border-l-4 border-l-transparent hover:border-l-blue-400"
                        onClick={() => handleOpenChat(ticket.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:shadow-md transition-all duration-300">
                              <User className="h-6 w-6 text-slate-600" />
                            </div>
                            <div className="flex-1 min-w-0 space-y-3">
                              <div className="flex items-center gap-3 flex-wrap">
                                <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors text-lg">
                                  {ticket.customer_name}
                                </h3>
                                {getStatusDisplay(ticket.is_active)}
                                {ticket.unreadCount &&
                                  ticket.unreadCount > 0 && (
                                    <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 font-medium">
                                      {ticket.unreadCount} new
                                    </Badge>
                                  )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-slate-400" />
                                <span className="text-sm text-slate-600">
                                  {ticket.customer_email}
                                </span>
                              </div>
                              <p className="text-slate-700 line-clamp-2 leading-relaxed">
                                {ticket.enquiry}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-3 flex-shrink-0 ml-6">
                            <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                              <Clock className="h-3 w-3 mr-1.5" />
                              {format(
                                new Date(ticket.created_at),
                                "MMM d, h:mm a"
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:shadow-md"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                              <ArrowUpRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
