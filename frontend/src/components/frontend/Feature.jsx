export default function Example() {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
            
            <div className="max-md:px-4 mx-12 pt-12 pb-12">
                <div className="flex items-center justify-center max-h-[450px] gap-6 mt-6">
                    <p className="bg-gradient-to-r from-slate-800 to-[#4D6EA3] text-transparent bg-clip-text text-3xl  font-medium max-w-2xl">Why do 500+ companies choose to integrate our features?</p>
                    <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/image-6.svg" alt="features showcase" />
                    <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/image-5.svg" alt="features showcase" className="max-md:w-full" />
                </div>
            </div>
        </>
    );
};