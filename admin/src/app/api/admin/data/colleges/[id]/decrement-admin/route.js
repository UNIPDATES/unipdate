// PUT /api/admin/data/colleges/[id]/decrement-admin/route.js  
export const PUT = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  try {
    const college = await College.findById(params.id);
    if (!college) return NextResponse.json({ message: 'College not found' }, { status: 404 });
    
    college.uniAdminCount = Math.max(0, college.uniAdminCount - 1);
    await college.save();
    
    return NextResponse.json(college, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating college' }, { status: 500 });
  }
}, ['superadmin']);