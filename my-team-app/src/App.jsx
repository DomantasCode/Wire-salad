import React, { useState, useEffect, useCallback } from 'react';

// Department to color mapping for consistent styling
const departmentColors = {
    'Upper Management': { bg: 'bg-red-100', text: 'text-red-800' },
    'Product Development': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'Marketing': { bg: 'bg-green-100', text: 'text-green-800' },
    'Human Resources': { bg: 'bg-purple-100', text: 'text-purple-800' },
    'Customer Support': { bg: 'bg-indigo-100', text: 'text-indigo-800' },
    'Finance': { bg: 'bg-pink-100', text: 'text-pink-800' },
    'Operations': { bg: 'bg-orange-100', text: 'text-orange-800' },
    'Design': { bg: 'bg-teal-100', text: 'text-teal-800' },
    'Engineering': { bg: 'bg-lime-100', text: 'text-lime-800' },
    'IT': { bg: 'bg-cyan-100', text: 'text-cyan-800' },
    'Research & Development': { bg: 'bg-fuchsia-100', text: 'text-fuchsia-800' },
    'Legal': { bg: 'bg-rose-100', text: 'text-rose-800' },
    'Public Relations': { bg: 'bg-amber-100', text: 'text-amber-800' },
    'Quality Assurance': { bg: 'bg-emerald-100', text: 'text-emerald-800' },
    'Other': { bg: 'bg-gray-100', text: 'text-gray-800' },
};

// Helper to get department-specific colors
const getDepartmentStyle = (department) => {
    return departmentColors[department] || departmentColors['Other'];
};

// Custom Scrollbar CSS (inline for immersive)
const customScrollbarStyle = `
  .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
`;

// --- Reusable UI Components ---

const LoadingSpinner = () => ( <div className="flex justify-center items-center py-10"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BCCB30]"></div></div> );

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => ( <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center"><p className="text-[#161614] text-lg mb-6">{message}</p><div className="flex justify-center space-x-4"><button onClick={onConfirm} className="px-6 py-2 rounded-xl text-white font-semibold bg-red-600 hover:bg-red-700">Confirm</button><button onClick={onCancel} className="px-6 py-2 rounded-xl text-[#161614] font-semibold bg-gray-200 hover:bg-gray-300">Cancel</button></div></div></div> );

const Header = ({ userId, onAddPersonClick, showAddPersonButton }) => ( <header className="sticky top-0 z-40 w-full bg-white rounded-b-2xl shadow-xl p-4 flex flex-col sm:flex-row items-center justify-between"><div className="flex items-center mb-4 sm:mb-0"><img src="https://placehold.co/64x64/BCCB30/FFFFFF?text=LOGO" alt="Wire Salad Logo" className="h-16 mr-4 rounded-xl shadow-md" /><div><h1 className="text-3xl font-extrabold text-[#161614] tracking-tight">WIRE SALAD</h1><p className="text-sm text-[#666563] font-semibold mt-1">INNOVATING, TOGETHER</p></div></div><div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4"><div className="text-sm text-[#666563] flex items-center">User ID:<span className="font-mono text-xs text-[#161614] truncate max-w-[150px] sm:max-w-none ml-2 p-1 bg-gray-100 rounded-md">{userId || 'Loading...'}</span></div>{showAddPersonButton && (<button onClick={onAddPersonClick} className="px-6 py-2.5 rounded-xl text-white font-semibold bg-[#BCCB30] hover:bg-[#A3B02C]">+ Add Person</button>)}</div></header> );

const PersonCard = ({ person, onClick }) => { const { bg, text } = getDepartmentStyle(person.department); const imageUrl = person.imageUrl || "https://placehold.co/128x128/C3C2B9/FFFFFF?text=No+Image"; return ( <div onClick={() => onClick(person._id)} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out flex flex-col items-center p-4 cursor-pointer h-full justify-between w-full"><img src={imageUrl} alt={person.name} className="w-32 h-32 object-cover rounded-full border-4 border-[#C3C2B9] shadow-md mb-4" /><h3 className="text-xl font-bold text-[#161614] mb-1 text-center">{person.name}</h3><div className={`px-3 py-1 rounded-full text-sm font-semibold ${bg} ${text} mb-2 text-center`}>{person.department}</div>{person.roleLevel && ( <p className="text-xs text-[#666563] mt-0 mb-1 text-center font-medium italic">{person.roleLevel}</p> )}<p className="text-sm text-[#666563] mt-1 text-center">{person.specialty}</p></div> ); };

const PersonDetailPane = ({ person, onClose, onEdit }) => { if (!person) return null; const imageUrl = person.imageUrl || "https://placehold.co/128x128/C3C2B9/FFFFFF?text=No+Image"; const { bg, text } = getDepartmentStyle(person.department); return ( <div className="fixed inset-0 z-40"><div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div><div className="absolute top-0 left-0 h-full w-full sm:w-96 bg-gradient-to-br from-[#4F3E18] to-[#9A4F21] shadow-2xl rounded-tr-2xl rounded-br-2xl transform transition-transform duration-300 ease-out translate-x-0"><button onClick={onClose} className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2" aria-label="Close"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button><div className="w-full h-full text-left flex flex-col px-8 pb-8 pt-16 overflow-y-auto custom-scrollbar text-white"><img src={imageUrl} alt={person.name} className="w-36 h-36 object-cover rounded-full border-4 border-white shadow-lg mx-auto mb-6" /><h2 className="text-3xl font-extrabold text-center mb-2">{person.name}</h2><div className={`px-4 py-1 rounded-full text-sm font-semibold mx-auto mb-4 ${bg} ${text}`}>{person.department}</div>{person.roleLevel && ( <p className="text-base text-center text-white opacity-90 mb-2 font-medium italic">{person.roleLevel}</p> )}<p className="text-lg font-medium text-center text-white opacity-90 mb-6">{person.specialty}</p><div className="space-y-4 text-base leading-relaxed text-white opacity-80">{person.shortBio && (<div><p className="font-semibold mb-1">About:</p><p>{person.shortBio}</p></div>)}{person.howIGotInto && (<div><p className="font-semibold mb-1">How I Got Into What I Do:</p><p>{person.howIGotInto}</p></div>)}{person.hobbies && person.hobbies.length > 0 && (<div><p className="font-semibold mb-1">Hobbies:</p><p>{person.hobbies.join(', ')}</p></div>)}{person.funnyFact && (<div><p className="font-semibold mb-1">Funny Fact:</p><p>{person.funnyFact}</p></div>)}{person.location && (<div><p className="font-semibold mb-1">Location:</p><p>{person.location}</p></div>)}{person.startDate && (<div><p className="font-semibold mb-1">Start Date:</p><p>{new Date(person.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p></div>)}</div><button onClick={onEdit} className="mt-10 px-8 py-3 bg-[#BCCB30] text-white rounded-xl font-semibold shadow-lg hover:bg-[#A3B02C] w-full">Edit Profile</button></div></div></div> ); };

const PersonForm = ({ person, onSave, onCancel, onDelete, isSaving }) => {
    const [formData, setFormData] = useState(person || { name: '', department: 'Upper Management', specialty: '', roleLevel: '', location: '', shortBio: '', howIGotInto: '', hobbies: [], funnyFact: '', startDate: '', imageUrl: '' });
    const [imagePreview, setImagePreview] = useState(person?.imageUrl || '');
    const [hobbyInput, setHobbyInput] = useState('');
    useEffect(() => { if (person) { setFormData(person); setImagePreview(person.imageUrl || ''); setHobbyInput(''); } else { setFormData({ name: '', department: 'Upper Management', specialty: '', roleLevel: '', location: '', shortBio: '', howIGotInto: '', hobbies: [], funnyFact: '', startDate: '', imageUrl: '' }); setImagePreview(''); setHobbyInput(''); } }, [person]);
    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
    const handleImageChange = (e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => { setImagePreview(reader.result); setFormData(prev => ({ ...prev, imageUrl: reader.result })); }; reader.readAsDataURL(file); } else { setImagePreview(''); setFormData(prev => ({ ...prev, imageUrl: '' })); } };
    const handleHobbyInputChange = (e) => { setHobbyInput(e.target.value); };
    const handleAddHobby = () => { if (hobbyInput.trim() && !formData.hobbies.includes(hobbyInput.trim())) { setFormData(prev => ({ ...prev, hobbies: [...prev.hobbies, hobbyInput.trim()] })); setHobbyInput(''); } };
    const handleRemoveHobby = (hobbyToRemove) => { setFormData(prev => ({ ...prev, hobbies: prev.hobbies.filter(hobby => hobby !== hobbyToRemove) })); };
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    const departments = Object.keys(departmentColors).sort((a, b) => { if (a === 'Upper Management') return -1; if (b === 'Upper Management') return 1; return a.localeCompare(b); });
    return ( <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"><h2 className="text-3xl font-extrabold text-[#161614] mb-6 text-center">{person ? 'Edit Profile' : 'Add New Person'}</h2><form onSubmit={handleSubmit} className="space-y-4"><div className="flex flex-col items-center mb-6"><label htmlFor="image-upload" className="cursor-pointer"><div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-[#C3C2B9] shadow-md relative group">{imagePreview ? ( <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" /> ) : ( <div className="text-gray-500 text-sm flex flex-col items-center justify-center"><svg className="w-10 h-10 mb-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-4 4 4 4-4V5h-2a1 1 0 100 2h2v4.586l-2.707-2.707A1 1 0 0010.586 9.414L8 12l-3-3a1 1 0 00-1.414 1.414L6.586 14H4V5h12v10zM10 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path></svg><span>Let us see you!</span></div> )}</div></label><input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" /></div><div><label htmlFor="name" className="block text-sm font-medium text-[#161614] mb-1">Name</label><input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 border border-[#C3C2B9] rounded-lg" required /></div><div><label htmlFor="department" className="block text-sm font-medium text-[#161614] mb-1">Department</label><select id="department" name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-2.5 border border-[#C3C2B9] rounded-lg" required >{departments.map(dept => ( <option key={dept} value={dept}>{dept}</option> ))}</select></div><div><label htmlFor="specialty" className="block text-sm font-medium text-[#161614] mb-1">Specialty</label><input type="text" id="specialty" name="specialty" value={formData.specialty} onChange={handleChange} className="w-full px-4 py-2.5 border border-[#C3C2B9] rounded-lg" required /></div><div><label htmlFor="roleLevel" className="block text-sm font-medium text-[#161614] mb-1">Role Level (Optional)</label><select id="roleLevel" name="roleLevel" value={formData.roleLevel} onChange={handleChange} className="w-full px-4 py-2.5 border border-[#C3C2B9] rounded-lg" ><option value="">Select Role Level</option><option value="Team Lead">Team Lead</option><option value="Specialist">Specialist</option><option value="Intern">Intern</option></select></div><div className="relative"><label htmlFor="shortBio" className="block text-sm font-medium text-[#161614] mb-1">Short Bio</label><textarea id="shortBio" name="shortBio" value={formData.shortBio} onChange={handleChange} rows="4" className="w-full px-4 py-2.5 border border-[#C3C2B9] rounded-lg" required ></textarea></div><div><label htmlFor="howIGotInto" className="block text-sm font-medium text-[#161614] mb-1">How I Got Into What I Do</label><textarea id="howIGotInto" name="howIGotInto" value={formData.howIGotInto} onChange={handleChange} rows="3" className="w-full px-4 py-2.5 border border-[#C3C2B9] rounded-lg" ></textarea></div><div><label htmlFor="hobbies" className="block text-sm font-medium text-[#161614] mb-1">Hobbies</label><div className="flex space-x-2 mb-2"><input type="text" id="hobbyInput" value={hobbyInput} onChange={handleHobbyInputChange} onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddHobby(); } }} className="flex-grow px-4 py-2.5 border border-[#C3C2B9] rounded-lg" placeholder="Add a hobby" /><button type="button" onClick={handleAddHobby} className="px-4 py-2 rounded-lg bg-gray-200 text-[#161614] font-semibold hover:bg-gray-300">Add</button></div><div className="flex flex-wrap gap-2">{formData.hobbies.map((hobby, index) => ( <span key={index} className="flex items-center bg-[#F0F0F0] text-[#666563] px-3 py-1 rounded-full text-sm">{hobby}<button type="button" onClick={() => handleRemoveHobby(hobby)} className="ml-2 text-gray-500 hover:text-gray-700"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></span> ))}</div></div><div className="relative"><label htmlFor="funnyFact" className="block text-sm font-medium text-[#161614] mb-1">Funny Fact</label><textarea id="funnyFact" name="funnyFact" value={formData.funnyFact} onChange={handleChange} rows="2" className="w-full px-4 py-2.5 border border-[#C3C2B9] rounded-lg" ></textarea></div><div><label htmlFor="startDate" className="block text-sm font-medium text-[#161614] mb-1">Start Date</label><input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full px-4 py-2.5 border border-[#C3C2B9] rounded-lg" /></div><div><label htmlFor="location" className="block text-sm font-medium text-[#161614] mb-1">Location</label><input type="text" id="location" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2.5 border border-[#C3C2B9] rounded-lg" /></div><div className="flex flex-col sm:flex-row justify-between mt-6 space-y-3 sm:space-y-0 sm:space-x-4">{person && (<button type="button" onClick={() => onDelete(person._id)} className="px-6 py-2.5 rounded-xl text-white font-semibold bg-red-600 hover:bg-red-700">Delete Profile</button> )}<div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 ml-auto"><button type="button" onClick={onCancel} className="px-6 py-2.5 rounded-xl text-[#161614] font-semibold bg-gray-200 hover:bg-gray-300">Cancel</button><button type="submit" className="px-6 py-2.5 rounded-xl text-white font-semibold bg-[#BCCB30] hover:bg-[#A3B02C]" disabled={isSaving}>{isSaving ? 'Saving...' : (person ? 'Update Profile' : 'Add Profile')}</button></div></div></form></div></div> );
};

// Main App Component
const App = () => {
    // STATE
    const [people, setPeople] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState('local-user');
    const [currentFormView, setCurrentFormView] = useState(null);
    const [selectedPersonId, setSelectedPersonId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [personToDeleteId, setPersonToDeleteId] = useState(null);
    const selectedPerson = selectedPersonId ? people.find(p => p._id === selectedPersonId) : null;

    // DATA FETCHING
    useEffect(() => {
        fetch('http://localhost:3001/api/people')
            .then(response => response.json())
            .then(data => { setPeople(data); setIsLoading(false); })
            .catch(error => { console.error("Error fetching data:", error); setIsLoading(false); });
    }, []);

    // --- CRUD OPERATIONS ---

    // CREATE
    const handleAddPerson = async (personData) => {
        setIsSaving(true);
        try {
            const response = await fetch('http://localhost:3001/api/people', {
                method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(personData),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const savedPerson = await response.json();
            setPeople(prevPeople => [...prevPeople, savedPerson]);
            closeFormsAndPanes();
        } catch (error) { console.error('Error adding person:', error); }
        finally { setIsSaving(false); }
    };

    // UPDATE
    const handleUpdatePerson = async (personData) => {
        setIsSaving(true);
        try {
            const response = await fetch(`http://localhost:3001/api/people/${personData._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(personData),
            });
            if (!response.ok) throw new Error('Network response was not ok');

            const updatedPerson = await response.json();
            setPeople(prev => prev.map(p => (p._id === updatedPerson._id ? updatedPerson : p)));
            closeFormsAndPanes();
        } catch (error) {
            console.error('Error updating person:', error);
        } finally {
            setIsSaving(false);
        }
    };

    // DELETE
    const handleDeletePerson = useCallback(async (id) => {
        setShowConfirmation(false);
        try {
            const response = await fetch(`http://localhost:3001/api/people/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok && response.status !== 204) {
                throw new Error('Network response was not ok for delete');
            }
            setPeople(prevPeople => prevPeople.filter(p => p._id !== id));
            closeFormsAndPanes();
            setPersonToDeleteId(null);
        } catch (error) {
            console.error('Error deleting person:', error);
        }
    }, []);

    // --- UI HANDLERS ---
    const openAddForm = () => { setSelectedPersonId(null); setCurrentFormView('add'); };
    const openEditForm = useCallback((id) => { setSelectedPersonId(id); setCurrentFormView('edit'); }, []);
    const openDetailPane = useCallback((id) => { setSelectedPersonId(id); setCurrentFormView('detail'); }, []);
    const closeFormsAndPanes = () => { setCurrentFormView(null); setSelectedPersonId(null); };
    const handleConfirmDelete = useCallback((id) => { setPersonToDeleteId(id); setShowConfirmation(true); }, []);
    const executeDelete = useCallback(() => { if (personToDeleteId) { handleDeletePerson(personToDeleteId); } }, [personToDeleteId, handleDeletePerson]);
    const cancelDelete = useCallback(() => { setShowConfirmation(false); setPersonToDeleteId(null); }, []);

    // --- RENDER LOGIC ---
    const groupedPeople = people.reduce((acc, person) => { const dept = person.department || 'Other'; if (!acc[dept]) { acc[dept] = []; } acc[dept].push(person); return acc; }, {});
    const sortedDepartments = Object.keys(groupedPeople).sort((a, b) => { if (a === 'Upper Management') return -1; if (b === 'Upper Management') return 1; return a.localeCompare(b); });
    for (const dept of sortedDepartments) { groupedPeople[dept].sort((a, b) => (new Date(a.startDate) > new Date(b.startDate) ? 1 : -1)); }
    const showAddPersonButton = currentFormView === null || currentFormView === 'detail';

    return (
        <div className="min-h-screen bg-[#F8F8F8] text-[#161614] font-sans">
            <style>{customScrollbarStyle}</style>
            <Header userId={userId} onAddPersonClick={openAddForm} showAddPersonButton={showAddPersonButton} />
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-5xl font-extrabold text-[#161614] tracking-tight text-center mb-4 mt-4 sm:mt-0">Meet Your Team</h1>
                <p className="text-xl text-[#666563] italic text-center mb-12">Real people creating real impact.</p>
                {isLoading ? <LoadingSpinner /> : (
                    <>
                        {people.length === 0 && !isLoading && <div className="text-center text-[#666563] py-10 text-lg">No team members found. Add one to get started!</div>}
                        {sortedDepartments.map(department => (
                            <section key={department} className="mb-16">
                                <h2 className="text-3xl font-bold text-[#161614] mb-8 text-center border-b-2 border-[#C3C2B9] pb-4 uppercase tracking-wide">{department}</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                    {groupedPeople[department].map(person => ( <PersonCard key={person._id} person={person} onClick={openDetailPane} /> ))}
                                </div>
                            </section>
                        ))}
                    </>
                )}
            </main>
            {(currentFormView === 'add' || currentFormView === 'edit') && <PersonForm person={selectedPerson} onSave={currentFormView === 'add' ? handleAddPerson : handleUpdatePerson} onCancel={closeFormsAndPanes} onDelete={handleConfirmDelete} isSaving={isSaving} />}
            {currentFormView === 'detail' && selectedPerson && <PersonDetailPane person={selectedPerson} onClose={closeFormsAndPanes} onEdit={() => openEditForm(selectedPerson._id)} />}
            {showConfirmation && <ConfirmationDialog message="Are you sure you want to delete this profile? This action cannot be undone." onConfirm={executeDelete} onCancel={cancelDelete} />}
        </div>
    );
};

export default App;
