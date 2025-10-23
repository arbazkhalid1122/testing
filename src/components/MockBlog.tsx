import { blogImage2 as blogImage } from "@/assets";
import Image from "next/image";

export default function MockBlog() {
  return (
    <div className="space-y-10">
      <p>
        Lorem ipsum dolor sit amet consectetur. Porttitor sed mauris odio
        egestas volutpat netus. Magna in enim proin vehicula. Tincidunt eu
        integer diam consequat mattis viverra felis mauris. Felis dui eros
        egestas tellus tincidunt nunc varius. At odio quam risus fusce sed nunc
        aliquet. Neque fermentum molestie pharetra amet nullam sit. Ut integer
        elit volutpat bibendum placerat lectus phasellus dictum. Imperdiet ut
        fringilla adipiscing eu blandit massa. Tincidunt aliquet dignissim
        faucibus quis arcu gravida diam dictum. A aliquam elit volutpat sed
        vivamus dictum. Integer ullamcorper elementum accumsan adipiscing
        tortor. Lectus convallis ornare nunc ipsum nam id sit. Id quam eu nibh
        sagittis porttitor. Volutpat nec sollicitudin sapien vitae aliquet neque
        viverra dignissim. Ac fusce ornare tincidunt odio morbi fermentum eget.
        Varius aliquet posuere velit elit. Id ornare ut ullamcorper lectus vel
        tortor turpis. Sed elit ullamcorper suspendisse ridiculus arcu.
        Tristique sed eget a nibh viverra nisi aenean non. Proin duis posuere
        pellentesque tempor. Iaculis lacus pharetra est tincidunt non bibendum
        nulla. Auctor facilisi quis consectetur sed convallis gravida egestas.
        Etiam sodales posuere pretium proin nunc ultrices vivamus proin mi.
        Commodo mattis ut egestas ultricies rhoncus. Mauris scelerisque nunc eu
        est facilisis hac tincidunt dictum. Neque eu enim lacus donec viverra
        turpis. Cursus quam purus diam consequat nunc feugiat vitae consequat
        ante. Amet convallis vel amet arcu. At quam elementum interdum vitae
        arcu consectetur. Leo rhoncus pharetra vitae vulputate etiam integer
        lectus. Vel ligula viverra iaculis eu nec. Lacus blandit sed in aliquam
        bibendum pretium donec.
      </p>
      <Image
        className="max-h-[25rem] w-full rounded-md object-cover"
        src={blogImage}
        alt="blogImage"
      />
      <p>
        Lorem ipsum dolor sit amet consectetur. Porttitor sed mauris odio
        egestas volutpat netus. Magna in enim proin vehicula. Tincidunt eu
        integer diam consequat mattis viverra felis mauris. Felis dui eros
        egestas tellus tincidunt nunc varius. At odio quam risus fusce sed nunc
        aliquet. Neque fermentum molestie pharetra amet nullam sit. Ut integer
        elit volutpat bibendum placerat lectus phasellus dictum. Imperdiet ut
        fringilla adipiscing eu blandit massa. Tincidunt aliquet dignissim
        faucibus quis arcu gravida diam dictum. A aliquam elit volutpat sed
        vivamus dictum. Integer ullamcorper elementum accumsan adipiscing
        tortor. Lectus convallis ornare nunc ipsum nam id sit. Id quam eu nibh
        sagittis porttitor. Volutpat nec sollicitudin sapien vitae aliquet neque
        viverra dignissim. Ac fusce ornare tincidunt odio morbi fermentum eget.
        Varius aliquet posuere velit elit. Id ornare ut ullamcorper lectus vel
        tortor turpis. Sed elit ullamcorper suspendisse ridiculus arcu.
        Tristique sed eget a nibh viverra nisi aenean non. Proin duis posuere
        pellentesque tempor. Iaculis lacus pharetra est tincidunt non bibendum
        nulla. Auctor facilisi quis consectetur sed convallis gravida egestas.
        Etiam sodales posuere pretium proin nunc ultrices vivamus proin mi.
        Commodo mattis ut egestas ultricies rhoncus. Mauris scelerisque nunc eu
        est facilisis hac tincidunt dictum. Neque eu enim lacus donec viverra
        turpis. Cursus quam purus diam consequat nunc feugiat vitae consequat
        ante. Amet convallis vel amet arcu. At quam elementum interdum vitae
        arcu consectetur. Leo rhoncus pharetra vitae vulputate etiam integer
        lectus. Vel ligula viverra iaculis eu nec. Lacus blandit sed in aliquam
        bibendum pretium donec.
      </p>
    </div>
  );
}
