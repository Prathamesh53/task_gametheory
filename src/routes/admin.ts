import express,{Request,Response} from 'express'
import Site from '../models/sites';
import mongoose from 'mongoose';
import Court from '../models/court';
import Book from '../models/book';
const app = express();


app.post('/sites', async (req: Request, res: Response) => {
    const { name, location } = req.body;
  
    if (!name || !location) {
        res.status(400).json({success:false, error: 'All fields (name, location) are required' });
        return;
    }
  
    try {
      const existingSite = await Site.findOne({ name, location });
      if (existingSite) {
        res.status(400).json({ success:false, error: 'Site with this name already exists in the specified location' });
        return;
      }
  
      const newSite = new Site({
        name, 
        location,
      });
      await newSite.save();
      res.status(201).json({success:true});
    } catch (error) {
      res.status(500).json({ success:false,error: 'Error adding site' });
    }
});



// POST add new court
app.post('/courts', async (req: Request, res: Response) => {
    const { type, siteId } = req.body;
  
    if (!type || !siteId) {
       res.status(400).json({success:false, error: 'Court type and siteId are required' });
       return;
    }
  
    if (!mongoose.Types.ObjectId.isValid(siteId)) {
       res.status(400).json({success:false, error: 'Invalid siteId' });
       return;
    }
  
    try {
      const site = await Site.findById(siteId);
      if (!site) {
         res.status(404).json({success:false, error: 'Site not found' });
         return;
      }
  
      const newCourt = new Court({
        type,
        site: siteId,
      });
  
      await newCourt.save();
      res.status(201).json({success:true});
  
    } catch (error) {
      res.status(500).json({success:false, error: 'Error adding court' });
    }
});
 

app.post('/bookings', async (req: Request, res: Response) => {
  const { date, time, courtId } = req.body;

  if (!date || !time || !courtId) {
    res.status(400).json({ success: false, error: 'Date, time, and courtId are required' });
    return;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bookingDate = new Date(date);
    bookingDate.setTime(bookingDate.getTime() + 24 * 60 * 60 * 1000); 
    if (isNaN(bookingDate.getTime())) {
      res.status(400).json({ success: false, error: 'Invalid date format' });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    const timePattern = /^(1[0-2]|[1-9]) (AM|PM)$/;
    if (!timePattern.test(time)) {
      res.status(400).json({ success: false, error: 'Invalid time format. Use format like "5 AM" or "6 PM"' });
      await session.abortTransaction();
      session.endSession();
      return;
    }
 
    const existingBooking = await Book.findOne({
      court: courtId,
      date: bookingDate,
      time
    }).session(session);

    if (existingBooking) {
      await session.abortTransaction();
      session.endSession();
      res.status(400).json({ success: false, error: 'This court is already booked for the selected time' });
      return;
    }
 
    const newBooking = new Book({
      date: bookingDate,
      time,
      court: courtId
    });

    await newBooking.save({ session });
 
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, booking: newBooking });
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, error: 'Error creating booking' });
  }
});


export default app;