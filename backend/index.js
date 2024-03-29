

const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
const { MongoClient } = require('mongodb');

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://roxiler-tech:Umw3hg6Xv6rCptvo@cluster0.nfnw30m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function connectToDatabase() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db('roxilercollection').collection('project1');
}

function extractMonth(dateString) {
    const date = new Date(dateString);
    return date.getMonth() + 1; 
}

// transactions
app.get("/transactions", async (req, res) => {
    const { search = '', page = 1, perPage = 10, month } = req.query;
    
    try {
        const collection = await connectToDatabase();

        const query = search ? {
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { price: parseFloat(search) || null }
            ]
        } : {};
        
        if (month) {
            const monthStart = new Date(`2024-${month}-01T00:00:00Z`);
            const monthEnd = new Date(new Date(monthStart).setMonth(monthStart.getMonth() + 1));
            console.log(monthStart)
            console.log(monthEnd)
            query.$and = [
                { dateOfSale: { $gte: monthStart } },
                { dateOfSale: { $lt: monthEnd } }
            ];
        }

        const totalCount = await collection.countDocuments(query);

        const currentPage = parseInt(page);
        const limit = parseInt(perPage);
        const skip = (currentPage - 1) * limit;

        const transactions = await collection.find(query).skip(skip).limit(limit).toArray();

        let totalValue = 0;
        transactions.forEach(transaction => {
            totalValue += transaction.price;
        });

        res.status(200).json({
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage,
            perPage: limit,
            totalValue,
            transactions
        });
    } catch (error) {
        console.error("Error listing transactions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



// statisctics
function extractMonth(dateString) {
    const date = new Date(dateString);
    return date.getMonth() + 1; 
}

app.get("/statistics", async (req, res) => {
    const { month } = req.query;
    console.log(month)

    try {
        const collection = await connectToDatabase();
        
        const pipeline = [];

        if (month) {
            pipeline.push({
                $match: {
                    $expr: {
                        $eq: [extractMonth("$dateOfSale"), parseInt(month)] 
                    }
                }
            });
        }

        pipeline.push(
            {
                $addFields: {
                    month: { $month: { $toDate: "$dateOfSale" } }
                }
            },
            {
                $group: {
                    _id: { month: "$month", sold: "$sold" },
                    totalAmount: { $sum: { $cond: [{ $eq: ["$sold", true] }, "$price", 0] } },
                    totalCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id.month",
                    sold: "$_id.sold",
                    totalAmount: 1,
                    totalCount: 1
                }
            }
        );

        const statistics = await collection.aggregate(pipeline).toArray();

        const formattedStatistics = {
            totalSaleAmount: 0,
            totalSoldItems: 0,
            totalNotSoldItems: 0
        };

        statistics.forEach(stat => {
            if (stat.sold === true) {
                formattedStatistics.totalSaleAmount += stat.totalAmount;
                formattedStatistics.totalSoldItems += stat.totalCount;
            } else {
                formattedStatistics.totalNotSoldItems += stat.totalCount;
            }
        });

        res.status(200).json(formattedStatistics);
    } catch (error) {
        console.error("Error fetching statistics:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.get("/bar-chart", async (req, res) => {
    
    const { month } = req.query;

    try {
        const collection = await connectToDatabase();

        const pipeline = [];

        if (month) {
            pipeline.push({
                $match: {
                    $expr: {
                        $eq: [extractMonth("$dateOfSale"), parseInt(month)] 
                    }
                }
            });
        }

        pipeline.push(
            {
                $addFields: {
                    priceRange: {
                        $switch: {
                            branches: [
                                { case: { $lte: ["$price", 100] }, then: "0 - 100" },
                                { case: { $lte: ["$price", 200] }, then: "101 - 200" },
                                { case: { $lte: ["$price", 300] }, then: "201 - 300" },
                                { case: { $lte: ["$price", 400] }, then: "301 - 400" },
                                { case: { $lte: ["$price", 500] }, then: "401 - 500" },
                                { case: { $lte: ["$price", 600] }, then: "501 - 600" },
                                { case: { $lte: ["$price", 700] }, then: "601 - 700" },
                                { case: { $lte: ["$price", 800] }, then: "701 - 800" },
                                { case: { $lte: ["$price", 900] }, then: "801 - 900" },
                                { case: true, then: "901-above" }
                            ]
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$priceRange",
                    count: { $sum: 1 }
                }
            }
        );

        const barChartData = await collection.aggregate(pipeline).toArray();

        res.status(200).json(barChartData);
    } catch (error) {
        console.error("Error fetching bar chart data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
