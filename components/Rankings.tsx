import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
  const ranked_items = [
    {
      rank: "1",
      name: "Smyth",
      rating: "10.0",
    },
    {
      rank: "2",
      name: "Au Cheval",
      rating: "9.6",
    },
    {
      rank: "3",
      name: "Formento's",
      rating: "8.5",
    },
    {
      rank: "4",
      name: "Goosefeather",
      rating: "7.7",
    },
    {
      rank: "5",
      name: "Medici on 57th",
      rating: "6.7",
    },
  ]
  
  export function Rankings() {
    return (
      <Table className="mt-24">
        <TableCaption>Your complete list of ranked items.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Rank</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Rating</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ranked_items.map((item) => (
            <TableRow key={item.rank}>
              <TableCell className="font-medium">{item.rank}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell className="text-right">{item.rating}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>
    )
  }
  