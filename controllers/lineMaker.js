const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const{pushNotificationStatic}=require("../utils/pushNotif")
const ShortUniqueId = require("short-unique-id");
const {
  createPendingL,
  createUserL,
  pushNotification,
  findBuss,
  deleteGroupAuth,
  changelineMakerApproveStatus,notification,getAllVarible
} = require("../utils/request");
const {refreshGLIne,refreshTruck,refresli,refreshTruckQr} = require("../utils/refresh");
const LineMaker = require("../models/LineMaker");
const Booking = require("../models/Booking");
const moment = require("moment");
const {walletUpdater,walletUpdaterApp}=require("../utils/wallet")
const mongoose = require('mongoose')
exports.setTime = asyncHandler(async (req, res, next) => {
  await LineMaker.findOneAndUpdate({ "user._id": req.user._id },{booking:[]})
  let index
  const user = await LineMaker.findOne({ "user._id": req.user._id }).populate({
    path: "booking",
  });

  // console.log("lineMaker", user);

  const { resultGenerate } = req.body;
  
  // ?
  

  let roz = [];
  resultGenerate.forEach((elem) => {
    roz.push(elem.time.substring(0, 10));
  });

  

  

  // biyad biron
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  let unique = roz.filter(onlyUnique);

  

  

  await LineMaker.findByIdAndUpdate(user._id, {
    $addToSet: { disabledDays: unique },
  });

  // agar tiket dashte bashe
  if (user.booking.length) {
    // tiket haee ke ghabeliyate forosh daran
    const esm = await user.booking.filter(
      (e) => e.isActive == true && !e.booking
    );

    // for ro tamame generate shode (onhaee ke isActive==true hast ro bahash kar darim)
    
    for (let j = 0; j < resultGenerate.length; j++) {
      
      const element = resultGenerate[j];
      if (element.isActive) {
        // hame onhaee ke ghabel forosh hastan
        for (let k = 0; k < esm.length; k++) {
          const elem = esm[k];

         

          // peyada konim ke to genrate omade va barabare ba database
          // ya update konim ya delete konim ya create konim
          if (
            elem.isActive &&
            elem.time.substring(0, 10) === element.time.substring(0, 10)
          ) {
            await LineMaker.findByIdAndUpdate(user._id, {
              $pull: { booking: elem._id },
            });
            await Booking.findByIdAndRemove(elem._id);

            if (element.isActive) {
              const day=element.time.substring(0, 10)
              const data = {
                time: element.time,
                isActive: element.isActive,
                price: element.price,
                lineMaker: user._id,
                remainQuqe:k+1,
                day
              };

              const create = await Booking.create(data);
              await LineMaker.findByIdAndUpdate(user._id, {
                $push: { booking: create._id },
              });
              element.isActive =false;
            }
          }

          if (
            element.isActive &&
            elem.time.substring(0, 10) !== element.time.substring(0, 10)
          ) {
            const day=element.time.substring(0, 10)
            const data = {
              time: element.time,
              isActive: element.isActive,
              price: element.price,
              lineMaker: user._id,
              quqeNumber:k+1,
              day
            };
            const create = await Booking.create(data);
            await LineMaker.findByIdAndUpdate(user._id, {
              $push: { booking: create._id },
            });
            element.isActive = false;
          }
        }
      }
    }
  } else {
    unique.forEach((item)=>{})
    for (let i = 0; i < resultGenerate.length; i++) {
      const element = resultGenerate[i];
      if (element.isActive) {
        const day=element.time.substring(0, 10)
        const data = {
          time: element.time,
          isActive: element.isActive,
          price: element.price,
          lineMaker: user._id,
          quqeNumber:i+1,
          day
        };
        const create = await Booking.create(data);
        await LineMaker.findByIdAndUpdate(user._id, {
          $push: { booking: create._id },
        });
      }
    }
  }

  await refreshGLIne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
exports.allBooking = asyncHandler(async (req, res, next) => {
    console.log('usser id' , req.user._id)
      const lineMakerID = await LineMaker.findOne({ "user._id": req.user._id })
    //   console.log( 'lineMaker' , lineMakerID._id)
     const user = await Booking.find({ lineMaker : lineMakerID._id})
     lineMakerID.booking = user
     console.log('all booking for user ' , lineMakerID)
  
  res.status(200).json({
    success: true,
    data: lineMakerID,
  });
});
exports.getLineMakerInfo = asyncHandler(async (req, res, next) => {
  const user = await LineMaker.findOne({ "user._id": req.user._id }).populate({
    path: "booking",
  });

  res.status(200).json({
    success: true,
    data: user.booking,
  });
});
exports.update = asyncHandler(async (req, res, next) => {
  const bookMe = await Booking.findById(req.params.id);

  if (!bookMe) {
    return next(new ErrorResponse(`booking not found`, 404));
  }

  const { price, isActive, booking, end } = req.body;

  await Booking.findByIdAndUpdate(
    req.params.id,
    {
      price,
      isActive,
      booking,
      end,
    },
    {
      new: true,
    }
  );

  await refreshGLIne()
  await refreshTruck()

  res.status(200).json({
    success: true,
    data: {},
  });
});
exports.allLineMaker = asyncHandler(async (req, res, next) => {
  const all = await LineMaker.find().populate({
    path: "booking",
  });

  res.status(200).json({
    success: true,
    data: all,
  });
});
exports.allLineMakerInTruck = asyncHandler(async (req, res, next) => {
  const lineMakers = await LineMaker.find({
    businessMan: req.params.id,
  }).populate({
    path: "booking",
    match: { booking: false }
  });
  res.status(200).json({
     success: true,
     data:lineMakers
  });
});
exports.booking = asyncHandler(async (req, res, next) => {
  const {
    orderId,
    where,
    lineMakerId,
    bookId,
    transportCapacity,
    truckType,
    truckPlate,
  } = req.body;

  const user = await LineMaker.findById(lineMakerId);

  if (!user) {
    return next(new ErrorResponse(`lineMaker not found`, 403));
  }

  

  const book = await Booking.findById(bookId)

const lineMaker=await LineMaker.findById(book.lineMaker)

 
    const lineMakertransaction=await walletUpdater(0,req.user._id,book.price*100,"LineMaker ticket cost","LineMaker")
    if(!lineMakertransaction.success){
      return next(new ErrorResponse("wallet section error",500))
    }
    const lineMakerCommision=await walletUpdater(1,lineMaker.user._id,book.price*100,"LineMaker ticket cost","LineMaker")
    if(!lineMakerCommision.success){
      return next(new ErrorResponse("wallet section error",500))
    }
    
  

  const driverData = {
    _id: req.user._id,
    companyName: req.body.companyName,
    profileCompany: req.body.profileCompany,
    phone: req.user.phone,
    transportCapacity: transportCapacity,
    truckType: truckType,
    truckPlate: truckPlate,
  };

  const uid = await new ShortUniqueId({ length: 8 });
  const invoiceNumber = await uid();

  const qrCode = `https://ashmorelinemaker.chinabizsetup.com/api/v1/linemaker/approveqrcode/${invoiceNumber}`;

  const createBooking = await Booking.findByIdAndUpdate(bookId, {
    booking: true,
    isActive: false,
    where: where,
    orderId: orderId,
    driver: driverData,
    qrUrl: qrCode,
    invoiceNumber
  });
  
  await updateAllquqeAfterBook(bookId)

  await refresli(user._id,req.user._id)
  await refreshTruck()
  await refreshTruckQr()
  res.status(200).json({
    success: true,
    data: createBooking,
  });
});
exports.allBookMe = asyncHandler(async (req, res, next) => {
  const user = await Booking.find({ "driver._id": req.user._id });

  res.status(200).json({
    success: true,
    data: user,
  });
});
exports.changePrice = asyncHandler(async (req, res, next) => {
  const find = await Booking.find({
    $and: [{ lineMaker: req.user._id }, { time: req.params.time }],
  });

  await Booking.findByIdAndUpdate(find._id, {
    price: req.params.price,
  });
  await refreshGLIne();
  
  res.status(200).json({
    success: true,
    data: {},
  });
});
exports.deleteBook = asyncHandler(async (req, res, next) => {
  await Booking.findByIdAndRemove(req.params.id);
  await refreshGLIne();
  await refreshTruck()
  res.status(200).json({
    success: true,
    data: {},
  });
});
exports.approveQrCode = asyncHandler(async (req, res, next) => {
  const book = await Booking.findOne({
    invoiceNumber: req.params.invoicenumber,
  });
  const user = await LineMaker.findOne({ "user._id": req.user._id });
  if (!book) {
    return next(new ErrorResponse(`book not found`, 403));
  }
  if (book.end) {
    return next(new ErrorResponse(`This ticket already Exist and end`, 403));
  }
  if(user._id==book.lineMaker){
    return next(new ErrorResponse(`This Book Is Not Valid For You `, 403));
  }
 const bookf= await Booking.findByIdAndUpdate(book._id, {
    end: true,
  });

await pushNotificationStatic(book.driver._id,1)  

await updateAllquqeAfterApprove(book._id)

await refreshGLIne()

await refreshTruck()

  res.status(200).json({
    success: true,
    data: {},
  });
});
exports.getCommerceLineMakerBooking = asyncHandler(async (req, res, next) => {
  const booking = LineMaker.find({ businessMan: req.user._id })
    .populate({ path: "booking" })
    .select("+booking");

  if (booking.length === 0 || !booking) {
    return res.status(200).json({
      success: true,
      data: "no book find",
    });
  }
  res.status(200).json({
    success: true,
    data: booking,
  });
});
exports.getCommerceLineMakerPanel = asyncHandler(async (req, res, next) => {
  const user=req.user
  const isAdmin = user.group.includes("admin");
  const isSuperAdmin = user.group.includes("superAdmin");
  if(!isAdmin&&!isSuperAdmin){
    return next(new ErrorResponse("you dont have access to this route ",401))
  }
  
  const lineMakers = await LineMaker.find({
    businessMan:req.params.id,
  })
  res.status(200).json({
    success: true,
    data:lineMakers ,
  });
});
exports.getCommerceLineMaker = asyncHandler(async (req, res, next) => {
 
  const lineMakers = await LineMaker.find({
    businessMan:req.user._id,
  })
  res.status(200).json({
    success: true,
    data:lineMakers ,
  });
});
exports.getBuss= asyncHandler(async (req, res, next) => {
  const user=req.user
  const isAdmin = user.group.includes("admin");
  const isSuperAdmin = user.group.includes("superAdmin");
  if(!isAdmin&&!isSuperAdmin){
    return next(new ErrorResponse("you dont have access to this route ",401))
  }
   const linemaker=await LineMaker.findOne({"user._id":req.params.id})
   const bussId=linemaker.businessMan
   const buss=await findBuss(bussId)
   const obj={
    _id:buss.user._id,
    username:buss.user.username,
    pictureProfile:buss.user.pictureProfile,
    companyName:buss.companyName
   }
   res.status(200).json({
    success:true,
    data:obj
   })
})
exports.rejectLineMakerCommerce = asyncHandler(async (req, res, next) => {


  const bussId=req.user._id
  const lineMakerId=req.params.id

  const approveObj={
    bussId:bussId,
    userId:lineMakerId
  }
  const authObj={
    group:"lineMaker",
    userId:lineMakerId
  }

  const approveresult=await changelineMakerApproveStatus(approveObj)
  const authresult=await deleteGroupAuth(authObj)

  if(!approveresult.success||!authresult.success){
    return next(new ErrorResponse("Proccess fail please try again ",500))
  }
  await LineMaker.findOneAndDelete({"user._id":lineMakerId})

  res.status(201).json({
    success: true,
  });
});
exports.rejectLineMakerCommerceAdmin= asyncHandler(async (req, res, next) => {
  const user=req.user
  const isAdmin = user.group.includes("admin");
  const isSuperAdmin = user.group.includes("superAdmin");
  if(!isAdmin&&!isSuperAdmin){
    return next(new ErrorResponse("you dont have access to this route ",401))
  }

  const bussId=req.params.bussId
  const lineMakerId=req.params.lineMakerId

  const approveObj={
    bussId:bussId,
    userId:lineMakerId,
    remover : req.user.username
  }
  const authObj={
    group:"lineMaker",
    userId:lineMakerId
  }

  const approveresult=await changelineMakerApproveStatus(approveObj)
  const authresult=await deleteGroupAuth(authObj)

  if(!approveresult.success||!authresult.success){
    return next(new ErrorResponse("Proccess fail please try again ",500))
  }
  await LineMaker.findOneAndDelete({"user._id":lineMakerId})

  res.status(201).json({
    success: true,
  });
});
exports.rejectBook= asyncHandler(async (req, res, next) => {
   const book=await Booking.findById(req.params.id)
   const lineMaker=await LineMaker.findOne({
    "user._id":req.user._id
   })
   if(!book){
    return next(new ErrorResponse("Book Not Found ",404))
   }

   if(!lineMaker){
    return next(new ErrorResponse("LineMaker Not Found ",404))
   }
   if(book.lineMaker==lineMaker._id){
    return next(new ErrorResponse("You Cant Reject this Book",403))
   }
   const lineMakertransaction=await walletUpdater(0,req.user._id,book.price*100,"LineMaker reject cost","LineMaker")
   if(!lineMakertransaction.success){
     return next(new ErrorResponse("wallet section error",500))
   }
   const lineMakerCommision=await walletUpdater(1,book.driver._id,book.price*100,"LineMaker reject cost","LineMaker")
   if(!lineMakerCommision.success){
     return next(new ErrorResponse("wallet section error",500))
   }
   

  await Booking.findByIdAndUpdate(req.params.id,{
    booking:false,
    isActive:true,
    qrUrl:"",
    orderId:""
  })
 await pushNotificationStatic(book.driver._id,2)
 await updateAllquqeAfterApprove(req.params.id)
 await refreshGLIne()
 await refreshTruck()
 await refreshTruckQr()
  res.status(200).json({
    success:true
  })
});
exports.getRemainQuqe= asyncHandler(async (req, res, next) => {
  const book=await Booking.findById(req.params.id)
 
  
   res.status(200).json({
    success:success,
    data:book.remainQuqe
   })
})


const updateAllquqeAfterApprove=async(bookId)=>{
  const book=await Booking.findById(bookId)
  const day=book.time.substring(0, 10)
  const all=await Booking.find({
    $and:[
      {end:false},
      {isActive:false},
      {booking:true},
      {lineMaker:book.lineMaker},
      {day:day}
    ]
  })
  const bookNumber=book.quqeNumber
  const after=all.filter(item=>item.quqeNumber>bookNumber)
  
  after.forEach(async(item)=>{
   const bb= await Booking.findById(item._id)
   bb.remainQuqe=bb.remainQuqe-1
   await bb.save()
  }) 
  return {success:true}
} 
const updateAllquqeAfterBook=async(bookId)=>{
  const book=await Booking.findById(bookId)
  const day=book.time.substring(0, 10)
  const all=await Booking.find({
    $and:[
      {end:false},
      {isActive:false},
      {booking:true},
      {lineMaker:book.lineMaker},
      {day:day}
    ]
  })
  const bookNumber=book.quqeNumber
  const before=all.filter(item=>item.quqeNumber<bookNumber)
  book.remainQuqe=before.length
  await book.save()
  const after=all.filter(item=>item.quqeNumber>bookNumber)
  after.forEach(async(item)=>{
   const bb= await Booking.findById(item._id)
   bb.remainQuqe=bb.remainQuqe+1
   await bb.save()
  }) 


  return {success:true}
} 

