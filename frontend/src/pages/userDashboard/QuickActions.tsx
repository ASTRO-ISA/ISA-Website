import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calendar, MessageCircle, ShoppingBag } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <>
      <Card className="bg-space-purple/10 border-space-purple/30">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button
              className="h-20 flex-col gap-2 bg-space-accent/20 hover:bg-space-accent/30"
              onClick={() => navigate("/training")}
            >
              <BookOpen className="w-6 h-6" />
              Browse Courses
            </Button>
            <Button
              className="h-20 flex-col gap-2 bg-space-accent/20 hover:bg-space-accent/30"
              onClick={() => navigate("/events")}
            >
              <Calendar className="w-6 h-6" />
              View Events
            </Button>
            <Button
              className="h-20 flex-col gap-2 bg-space-accent/20 hover:bg-space-accent/30"
              onClick={() => navigate("/community")}
            >
              <MessageCircle className="w-6 h-6" />
              Join Community
            </Button>
            <Button
              className="h-20 flex-col gap-2 bg-space-accent/20 hover:bg-space-accent/30"
              onClick={() => navigate("/shop")}
            >
              <ShoppingBag className="w-6 h-6" />
              Visit Shop
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default QuickActions;
