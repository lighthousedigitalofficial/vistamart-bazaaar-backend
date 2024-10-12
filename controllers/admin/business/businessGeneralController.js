import BusinessGeneral from './path/to/your/model'; // Adjust the path accordingly

// Create a new BusinessGeneral entry
export const createBusinessGeneral = async (req, res) => {
  try {
    const businessGeneralData = new BusinessGeneral(req.body);
    await businessGeneralData.save();
    res.status(201).json({ message: 'BusinessGeneral created successfully!', data: businessGeneralData });
  } catch (error) {
    res.status(400).json({ message: 'Error creating BusinessGeneral', error: error.message });
  }
};

// Get all BusinessGeneral entries
export const getAllBusinessGenerals = async (req, res) => {
  try {
    const businessGenerals = await BusinessGeneral.find();
    res.status(200).json(businessGenerals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching BusinessGenerals', error: error.message });
  }
};

// Get a BusinessGeneral by ID
export const getBusinessGeneralById = async (req, res) => {
  try {
    const { id } = req.params;
    const businessGeneral = await BusinessGeneral.findById(id);
    if (!businessGeneral) {
      return res.status(404).json({ message: 'BusinessGeneral not found' });
    }
    res.status(200).json(businessGeneral);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching BusinessGeneral', error: error.message });
  }
};

// Update a BusinessGeneral by ID
export const updateBusinessGeneral = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBusinessGeneral = await BusinessGeneral.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedBusinessGeneral) {
      return res.status(404).json({ message: 'BusinessGeneral not found' });
    }
    res.status(200).json({ message: 'BusinessGeneral updated successfully!', data: updatedBusinessGeneral });
  } catch (error) {
    res.status(400).json({ message: 'Error updating BusinessGeneral', error: error.message });
  }
};

// Delete a BusinessGeneral by ID
export const deleteBusinessGeneral = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBusinessGeneral = await BusinessGeneral.findByIdAndDelete(id);
    if (!deletedBusinessGeneral) {
      return res.status(404).json({ message: 'BusinessGeneral not found' });
    }
    res.status(200).json({ message: 'BusinessGeneral deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting BusinessGeneral', error: error.message });
  }
};
