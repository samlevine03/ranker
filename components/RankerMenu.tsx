"use client"

import React, { useState, useContext, useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Toggle } from "@/components/ui/toggle"
import { Textarea } from "@/components/ui/textarea"
import { Rankings } from "@/components/Rankings"
import TabContext from "./TabContext"


export function RankerMenu() {
  const [isBulkInput, setIsBulkInput] = useState(false);
  const { currentTab } = useContext(TabContext);
  const [hasMounted, setHasMounted] = useState(false);
  const [unrankedItems, setUnrankedItems] = useState<string[]>([]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleToggleChange = () => {
    setIsBulkInput(!isBulkInput);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isBulkInput) {
        // If it's bulk input, split the string by line breaks and trim each item
        setUnrankedItems(event.target.value.split('\n').map(item => item.trim()));
    } else {
        // If it's single item input, replace the array with the new item
        setUnrankedItems([event.target.value.trim()]);
    }
};

  const handleRankClick = () => {
    // Process the unranked items
    console.log("Ranking items:", unrankedItems);
    // Further processing can be done here
  };

  if (!hasMounted) {
    return null;
  }

  return (
    <Tabs defaultValue={currentTab} value={currentTab} className="w-[400px]">
      <TabsContent value="input">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>
              Add items to your rankings here. Once you click input, you&apos;ll be prompted to sort them.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              {isBulkInput ? (
                <>
                  <Label htmlFor="items">Items (separated by line breaks)</Label>
                  <Textarea id="items" defaultValue="" onChange={handleInputChange}/>
                </>
              ) : (
                <>
                  <Label htmlFor="item">Item Name</Label>
                  <Input id="item" defaultValue="" onChange={handleInputChange}/>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={handleRankClick}>
                  Rank
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Let the games begin!</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to rank these items?
                  </DialogDescription>
                </DialogHeader>
                {/* THIS IS WHERE THE RANKER SHOULD GO */}
              </DialogContent>
            </Dialog>
            <Toggle 
              variant="outline"
              onClick={handleToggleChange}
            >
                Bulk Input
              </Toggle>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="rankings">
        <Rankings />
      </TabsContent>
    </Tabs>
  )
}
