const Department = require("../Module/depMoule");

const addDepartment = async (req, res) => {
    try {
        const { dep_name, description } = req.body;

        console.log("Request body:", req.body);
        console.log("User from middleware:", req.user);

        if (!dep_name || dep_name.trim() === "") {
            return res.status(400).json({ success: false, error: "Department name required" });
        }

        const newDep = new Department({
            dep_name: dep_name.trim(),
            description
        });

        await newDep.save();
        console.log(newDep)

        return res.status(201).json({ success: true, department: newDep });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: "Failed to add department" });
    }
};

const getDepartments = async (req, res) => {
    try {
        const department = await Department.find()
        return res.status(200).json({ success: true, department })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Failed to get department" });
    }
}

//data get for edit department
const getDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const dep = await Department.findById({ _id: id })
        return res.status(200).json({ success: true, dep })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Failed to get department" });
    }
}


const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params
        const { dep_name, description } = req.body;
        const update = await Department.findByIdAndUpdate({ _id: id }, {
            dep_name,
            description
        })
        return res.status(200).json({ success: true, update })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Failed to edit department" });
    }
}



const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params

        const deleteDep = await Department.findByIdAndDelete(id);
        if (!deleteDep) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        await deleteDep.deleteOne()

        return res.status(200).json({ success: true, deleteDep, message: "Department deleted successfully" })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Failed to delete department" });
    }
}

module.exports = { addDepartment, getDepartments, getDepartment, updateDepartment, deleteDepartment };
