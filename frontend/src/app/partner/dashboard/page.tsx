"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, Package, Clock, FileText, User } from "lucide-react";
import Link from "next/link";

export default function DistributorDashboard() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="bg-muted p-6 rounded-full mb-6">
          <Package className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          No Activity Yet
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Your distributor dashboard is currently empty. Once you start
          receiving orders and managing your distribution, you'll see activity
          and statistics here.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mb-8">
          <div className="bg-muted/50 p-4 rounded-lg flex flex-col items-center">
            <Clock className="h-6 w-6 mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">Recent Orders</p>
            <p className="text-2xl font-bold mt-1">0</p>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg flex flex-col items-center">
            <FileText className="h-6 w-6 mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">Products</p>
            <p className="text-2xl font-bold mt-1">0</p>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg flex flex-col items-center">
            <User className="h-6 w-6 mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">Home</p>
            <p className="text-2xl font-bold mt-1">0</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/products" passHref>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Create New Order
            </Button>
          </Link>
          <Link href="/" passHref>
            <Button variant="outline">Go to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
