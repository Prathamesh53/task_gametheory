import express,{Request,Response} from 'express'
import Site from '../models/sites';
import mongoose from 'mongoose';
import Court from '../models/court';
import Book from '../models/book';
const app = express();

app.get('/locations', async (req: Request, res: Response) => {
    try {
      const locations = await Site.find().sort({createdAt:-1});
      res.status(200).json({success:true,locations});
    } catch (error) {
      res.status(500).json({success:false, error: 'Error fetching locations' });
    }
  });
  
  
  app.get('/courts', async (req: Request, res: Response) => {
      const siteId = req.query.site_id as string;
    
      if (!siteId) {
         res.status(400).json({ success: false, error: 'site_id is required' });
         return;
      }
    
      try {
        if (!mongoose.Types.ObjectId.isValid(siteId)) {
           res.status(400).json({ success: false, error: 'Invalid site_id' });
           return;
        }
    
        const site = await Site.findById(siteId);
        if (!site) {
           res.status(404).json({ success: false, error: 'Site not found' });
           return;
        }
    
        const courts = await Court.aggregate([
          {
            $match: { site: new mongoose.Types.ObjectId(siteId) }
          },
          {
            $group: {
              _id: "$type", 
            }
          },
          {
            $project: {
              type: "$_id", 
              _id: 0
            }
          },
          {
            $sort: {
              type: 1
            }
          }
        ]);
    
        res.status(200).json({ success: true, courts });
    
      } catch (error) {
        res.status(500).json({ success: false, error: 'Error fetching courts' });
      }
    });
  
  
  
  app.get('/bookings', async (req: Request, res: Response) => {
    const { site_id, courtType, date } = req.query;
  
    if (!site_id || !courtType || !date) {
      res.status(400).json({ success: false, error: 'site_id, courtType, and date are required' });
      return;
    }
  
    try {
      if (!mongoose.Types.ObjectId.isValid(site_id as string)) {
        res.status(400).json({ success: false, error: 'Invalid site_id' });
        return;
      }
    
      const courts = await Court.find({ site: site_id, type: courtType });
      if (courts.length === 0) {
        res.status(404).json({ success: false, error: 'No courts found for the specified type at this site' });
        return;
      }
  
      const courtIds = courts.map(court => court._id);
    
      const startDate = new Date(date as string);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);
  
      const bookings = await Book.find({
        court: { $in: courtIds },
        date: { $gte: startDate, $lt: endDate }
      });
    
      const bookingsByCourt = courts.reduce((acc, court) => {
        acc[court._id.toString()] = { courtId: court._id, times: [] };
        return acc;
      }, {} as any);
    
      bookings.forEach(booking => {
        const courtId = booking.court.toString();
        const bookingTime = booking.time;
        bookingsByCourt[courtId].times.push(bookingTime);
      });
  
      const formattedBookings = Object.values(bookingsByCourt);
  
      res.status(200).json({ success: true, bookings: formattedBookings });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error fetching bookings' });
    }
  });
    

  export default app;