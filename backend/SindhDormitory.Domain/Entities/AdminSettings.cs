using System;
using System.ComponentModel.DataAnnotations;

namespace SindhDormitory.Domain.Entities
{
    /// <summary>
    /// Represents configurable admin settings for the dormitory system.
    /// </summary>
    public class AdminSettings : BaseEntity
    {
        [Key]
        public int SettingsId { get; set; }

        public bool AllocationOpen { get; set; }
        public DateTime? AllocationDeadline { get; set; }

        [Range(1, int.MaxValue)]
        public int MaxAllocationPerCycle { get; set; }

        public bool AllocationEnabled { get; set; }

        public DateTime EffectiveFrom { get; set; }
    }
}
