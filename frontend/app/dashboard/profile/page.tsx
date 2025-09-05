"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useSettings } from "@/contexts/settings-context";
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Briefcase,
  Award,
  FileText,
  Lock,
  Bell,
  CreditCard,
} from "lucide-react";

export default function ProfilePage() {
  const { settings } = useSettings();
  const [isEditing, setIsEditing] = useState(false);

  const userProfile = {
    name: settings.fullName,
    email: settings.email,
    phone: settings.phone,
    avatar: settings.avatar,
    position: "Financial Analyst",
    department: "Finance",
    location: "New York, NY",
    joinDate: "May 15, 2020",
    bio: "Experienced financial analyst with a focus on market trends and investment strategies. Passionate about data-driven decision making and financial technology innovations.",
    skills: [
      "Financial Analysis",
      "Data Visualization",
      "Market Research",
      "Risk Assessment",
      "Investment Planning",
    ],
    education: [
      {
        degree: "MBA, Finance",
        institution: "Columbia Business School",
        year: "2018",
      },
      {
        degree: "BS, Economics",
        institution: "University of Pennsylvania",
        year: "2014",
      },
    ],
    experience: [
      {
        position: "Senior Financial Analyst",
        company: "Flowers&Saints Inc.",
        period: "2020 - Present",
      },
      {
        position: "Financial Analyst",
        company: "Global Investments Ltd.",
        period: "2018 - 2020",
      },
      {
        position: "Junior Analyst",
        company: "First Capital Partners",
        period: "2014 - 2016",
      },
    ],
    projects: [
      { name: "Q3 Financial Forecast", status: "completed" },
      { name: "Investment Portfolio Analysis", status: "in-progress" },
      { name: "Risk Assessment Framework", status: "planning" },
    ],
    socialProfiles: {
      linkedin: "linkedin.com/in/dollarsingh",
      twitter: "twitter.com/dollarsingh",
      github: "github.com/dollarsingh",
    },
  };

  const statusColors = {
    completed:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "in-progress":
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    planning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  };

  return (
    <div className="space-y-6 p-8 max-sm:p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{userProfile.name}</h2>
              <p className="text-muted-foreground">{userProfile.position}</p>

              <div className="flex mt-4 space-x-2">
                <Button variant="outline" size="sm">
                  Message
                </Button>
                <Button variant="outline" size="sm">
                  Follow
                </Button>
              </div>

              <div className="w-full mt-6 space-y-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{userProfile.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{userProfile.phone}</span>
                </div>
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{userProfile.department}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{userProfile.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Joined {userProfile.joinDate}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      defaultValue={userProfile.bio}
                      className="min-h-[100px]"
                    />
                  ) : (
                    <p>{userProfile.bio}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userProfile.education.map((edu, index) => (
                      <div key={index} className="flex items-start">
                        <Award className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                        <div>
                          <h3 className="font-medium">{edu.degree}</h3>
                          <p className="text-sm text-muted-foreground">
                            {edu.institution}, {edu.year}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {userProfile.experience.map((exp, index) => (
                      <div key={index} className="flex">
                        <Briefcase className="h-5 w-5 mr-4 text-muted-foreground mt-0.5" />
                        <div>
                          <h3 className="font-medium">{exp.position}</h3>
                          <p className="text-sm text-muted-foreground">
                            {exp.company}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {exp.period}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">
                          Certified Financial Analyst (CFA)
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          CFA Institute, 2019
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">
                          Financial Risk Manager (FRM)
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Global Association of Risk Professionals, 2020
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Current Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userProfile.projects.map((project, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-4 border rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{project.name}</h3>
                          <Badge className={statusColors[project.status]}>
                            {project.status.charAt(0).toUpperCase() +
                              project.status.slice(1)}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Projects
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contributions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] bg-muted rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Contribution graph would appear here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={userProfile.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue={userProfile.email} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" defaultValue={userProfile.phone} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        defaultValue={userProfile.position}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="profile-visibility">
                        Profile Visibility
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Make your profile visible to other users
                      </p>
                    </div>
                    <Switch id="profile-visibility" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-visibility">Email Visibility</Label>
                      <p className="text-sm text-muted-foreground">
                        Show your email to other users
                      </p>
                    </div>
                    <Switch id="email-visibility" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lock className="h-5 w-5 mr-2" />
                      Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Change Password
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Manage Notifications
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Billing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Manage Billing
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Account
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Account Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
